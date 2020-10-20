import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  View,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native';
import {Text, Layout, Card, Button, Modal} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class Donate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      message: '',
      donationAmount: 0,
      isUpdated: this.props.isUpdated,
      user: this.props.user,
      modalVisible: false,
    };
  }

  // createTwoButtonAlert = (message) =>
  //   Alert.alert(
  //     'OpenJio',
  //     message,
  //     [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  //     {cancelable: false}
  //   );

  showDonationModal() {
    if (this.state.donationAmount === 0) {
      this.setState({
        message: 'Please enter a donation amount.',
      });
    } else if (this.state.donationAmount < 0) {
      this.setState({
        message: 'Please enter a valid amount.',
      });
      // } else if (this.state.donationAmount > this.props.user.Wallet.walletLimit) {
      //   this.setState({
      //     message: 'Donation amount exceeded transaction limit.'
      //   })
    } else if (this.state.donationAmount > this.state.user.Wallet.balance) {
      this.setState({
        message: 'Amount exceeded balance.',
      });
    } else {
      this.setState({
        modalVisible: true,
      });
    }
  }

  renderModal() {
    return (
      <Modal backdropStyle={styles.backdrop} visible={this.state.modalVisible}>
        <Card>
          <Text style={{textAlign: 'center'}}>Amount to donate:</Text>
          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
            SGD {this.state.donationAmount.toFixed(2)}
          </Text>

          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({modalVisible: false});
                this.handleDonation();
              }}>
              Confirm
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  modalVisible: false,
                  message: 'Donation was Cancelled',
                });
              }}>
              Dismiss
            </Button>
          </Layout>
        </Card>
      </Modal>
    );
  }

  async handleDonation() {
    if (this.state.donationAmount === null) {
      this.setState({
        message: 'Donation amount field is empty',
      });
    } else {
      try {
        //console.log(globalVariable.transactionApi + 'donate');
        //console.log(this.props.user.Wallet.walletId);
        //console.log(this.state.donationAmount);
        const response = await axios.post(
          globalVariable.transactionApi + 'donate',
          {
            walletId: this.props.user.Wallet.walletId,
            amount: this.state.donationAmount,
          }
        );
        //console.log(response.data);
        //this.createTwoButtonAlert('Thank you for your kind donation!');
        this.props.navigation.navigate('SuccessfulScreen', {
          amount: this.state.donationAmount,
          previousScreen: 'Donate',
        });
      } catch (error) {
        console.log(error);
        this.setState({
          message: 'Donation Failed.',
        });
      }
    }
  }

   //this method prevents returning NaN when Input has empty text
   safeParseFloat = (str) => {
    const value = Number.parseFloat(str);
    return Number.isNaN(value) ? 0 : value;    
  }

  render() {
    let responseMessage;
    if (this.state.isUpdated) {
      responseMessage = (
        <Text style={styles.description} status="success">
          {this.state.message}
        </Text>
      );
    } else {
      responseMessage = (
        <Text style={styles.description} status="danger">
          {this.state.message}
        </Text>
      );
    }

    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
        />

        <Text style={styles.header} category="h4">
          Donate
        </Text>

        <Card style={styles.donationMsg}>
          <Text styles={styles.header} >
            All donations will be used for the maintainence of OpenJio. Your
            donation would go a long way in helping us improve the operations of
            OpenJio!
          </Text>
        </Card>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Card style={styles.card}>
              <Text style={styles.payLabel}>Donation Amount</Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{marginTop: 10, marginRight: 5, fontWeight: 'bold'}}>
                  SGD
                </Text>
                <TextInput
                  keyboardType={'number-pad'}
                  style={styles.money}
                  value={this.state.donationAmount}
                  onChangeText={(amount) =>
                    this.setState({donationAmount: this.safeParseFloat(amount)})
                  }
                />
              </View>
            </Card>

            <Button
              style={styles.button}
              onPress={() => this.showDonationModal()}>
              Donate
            </Button>
            {responseMessage}
            {this.renderModal()}
          </Layout>
        </TouchableWithoutFeedback>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
  },
  payLabel: {
    color: '#3366FF',
    fontSize: 14,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  money: {
    flexGrow: 1,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#3366FF',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    marginTop: 20,
    width: 120,
    margin: 5,
  },
  donationMsg: {
    backgroundColor: 'white',
    marginBottom: 0,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Donate);
