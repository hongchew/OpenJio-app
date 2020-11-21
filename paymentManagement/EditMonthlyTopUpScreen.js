import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  Text,
  Layout,
  Card,
  Button,
  Modal as KittenModal,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import loginStyle from '../styles/loginStyle';
// import {requestOneTimePayment} from 'react-native-paypal';
import {setUser} from '../redux/actions';
import axios from 'axios';

class EditMonthlyTopUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      wallet: this.props.wallet,
      amount: 0,
      showModal: false,
      messageStatus: '',
      message: '',
      uri: '',
      showTopUpConfirmationModal: false,
    };
  }

  handleWebviewResponse = async (data) => {
    if (data.title === 'success') {
      this.setState({
        showModal: false,
        amount: 0,
        message: 'Update Success!\n',
        messageStatus: 'success',
      });
      const response = await axios.get(
        `${globalVariable.userApi}/${this.state.user.userId}`
      );
      console.log(response.data);
      this.props.setUser(response.data);
    } else if (data.title === 'cancel') {
      this.setState({
        showModal: false,
        message: 'Update was Cancelled',
        messageStatus: 'danger',
      });
    } else {
      return;
    }
  };

  topUpValidation = (amount) => {
    if (amount) {
      if (amount <= 0) {
        this.setState({
          message: 'Invalid top up amount',
          messageStatus: 'danger',
        });
      } else if (this.state.wallet.walletLimit === 0) {
        this.setState({
          message: 'Wallet limit is currently set to 0',
          messageStatus: 'danger',
        });
      } else {
        // no problem here, top up go through
        this.setState({
          showTopUpConfirmationModal: true,
          showModal: false,
          topUpURI: `${globalVariable.paypalApi}edit-monthly-topup?amount=${(
            this.state.amount * 100
          ).toString()}&recurrentAgreementId=${
            this.props.agreement.recurrentAgreementId
          }`,
        });
      }
    } else {
      this.setState({
        message: 'Please input new monthly top up amount',
        messageStatus: 'danger',
      });
    }
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
        />
        <Text style={styles.header} category="h4">
          Edit Monthly Top Up
        </Text>
        <ScrollView style={styles.container}>
          <Card style={styles.card}>
            <Text style={styles.label}>Current Monthly Top Up Amount</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginTop: 5}}>SGD </Text>
              <Text style={styles.currentMoney}>
                {this.props.agreement
                  ? this.props.agreement.amount.toFixed(2)
                  : '-'}
              </Text>
            </View>
            <Text style={styles.label}>New Monthly Top Up Amount</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginTop: 5}}>SGD </Text>
              <TextInput
                keyboardType={'number-pad'}
                style={styles.money}
                value={this.state.amount}
                onChangeText={(amount) =>
                  this.setState({amount: parseFloat(amount)})
                }
              />
            </View>
          </Card>
          <Button onPress={() => this.topUpValidation(this.state.amount)}>
            Update Change with Paypal
          </Button>
          <Modal
            visible={this.state.showModal}
            onRequestClose={() => this.setState({showModal: false})}>
            <WebView
              source={{
                uri: this.state.topUpURI,
              }}
              onNavigationStateChange={(data) =>
                this.handleWebviewResponse(data)
              }
              onMessage={() => {}}
              onError={() => {
                this.setState({
                  showModal: false,
                  message: 'An error occured, please try again later.',
                  messageStatus: 'danger',
                });
              }}
            />
          </Modal>
          <KittenModal
            style={{position: 'absolute'}}
            backdropStyle={styles.backdrop}
            visible={this.state.showTopUpConfirmationModal}>
            <Card style={styles.confirmationModal}>
              <Layout style={styles.confirmationModal}>
                <Text>You will be redirected to Paypal shortly</Text>
                <Text>New amount to top up monthly:</Text>
                <Text style={{fontWeight: 'bold'}}>
                  SGD {this.state.amount.toFixed(2)}
                </Text>
                <Layout style={styles.modalButtonsContainer}>
                  <Button
                    style={styles.modalButton}
                    size={'small'}
                    onPress={() => {
                      this.setState({
                        showModal: true,
                        showTopUpConfirmationModal: false,
                      });
                    }}>
                    Confirm
                  </Button>
                  <Button
                    appearance={'outline'}
                    style={styles.modalButton}
                    size={'small'}
                    onPress={() => {
                      this.setState({
                        showTopUpConfirmationModal: false,
                        showModal: false,
                        message: 'Update was Cancelled',
                        messageStatus: 'danger',
                      });
                    }}>
                    Dismiss
                  </Button>
                </Layout>
              </Layout>
            </Card>
          </KittenModal>
          <Text style={loginStyle.message} status={this.state.messageStatus}>
            {this.state.message}
          </Text>
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  container: {
    //backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: 'Karla-Bold',
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  actionContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  label: {
    color: '#3366FF',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  action: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  money: {
    flexGrow: 1,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#3366FF',
  },
  currentMoney: {
    flexGrow: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 16,
    marginTop: 10,
    paddingBottom: 30,
    textAlign: 'center',
  },
  buttonItem: {
    paddingTop: 20,
    marginLeft: 20,
    marginRight: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
  },
  modalButton: {
    marginTop: 20,
    width: 120,
    margin: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmationModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function mapStateToProps(state) {
  const agreement = state.user.Wallet.RecurrentAgreements.filter(
    (agreement) => agreement.recurrentAgreementType === 'TOP_UP'
  )[0];
  return {
    user: state.user,
    wallet: state.user.Wallet,
    agreement,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMonthlyTopUpScreen);
