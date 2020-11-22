import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  StatusBar,
} from 'react-native';
import {Text, Layout, Card, Input, Button, Modal} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class MakeRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      title: '',
      description: '',
      amount: '',
      message: '',
      announcementId: this.props.route.params.announcementId,
      submitModalVisible: false,
      topUpModalVisible: false,
    };
  }

  //triggered when user clicks on the Submit Request button
  handleSubmit() {
    if (this.state.title == '') {
      this.setState({
        message: 'Fields are empty, unable to proceed.',
      });
    } else if (this.state.amount <= 0) {
      this.setState({
        message: 'Invalid amount.',
      });
    } else if (this.state.amount > this.state.user.Wallet.balance) {
      this.setState({
        message: 'Amount exceeded balance.',
      });
    } else {
      this.setState({
        //if it passes all the checks, show the modal
        submitModalVisible: true,
      });
    }
  }

  //check if the total amount of all ongoing requests (PENDING, SCHEDULED, DOING, COMPLETED) and curr request exceeds the wallet balance
  async checkWalletBalance() {
    try {
      const ongoingRequests = await axios.get(
        globalVariable.requestApi + 'ongoing/' + this.state.user.userId
      );

      let unpaidAmt = 0;
      for (let request of ongoingRequests.data) {
        unpaidAmt += request.amount;
      }
      unpaidAmt += this.state.amount;
      // console.log(unpaidAmt, this.state.user.Wallet.balance);
      if (unpaidAmt > this.state.user.Wallet.balance) {
        //throw error if the current request causes wallet balance to be exceeded
        throw 'Exceeded balance';
      }
    } catch (error) {
      throw error;
    }
  }

  async handleMakeRequest() {
    try {
      await this.checkWalletBalance();
      const response = await axios.post(
        globalVariable.requestApi + 'create-request',
        {
          announcementId: this.state.announcementId,
          userId: this.state.user.userId,
          title: this.state.title,
          description: this.state.description,
          amount: this.state.amount,
        }
      );
      this.props.navigation.replace('Tabs', {
        screen: 'MyActivity',
        params: {
          filter: 'request',
          announcementBtn: 'basic',
          requestBtn: 'primary',
        },
      });
    } catch (error) {
      if (error === 'Exceeded balance') {
        this.setState({topUpModalVisible: true});
      }
      console.log(error);
      this.setState({
        message: 'Unable to make request.',
      });
    }
  }

  //this method prevents returning NaN when Input has empty text
  safeParseFloat = (str) => {
    const value = Number.parseFloat(str);
    return Number.isNaN(value) ? 0 : value;
  };

  renderSubmitModal() {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={this.state.submitModalVisible}>
        <Card>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            Are you sure you want to submit this request?
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({submitModalVisible: false});
                this.handleMakeRequest();
              }}>
              Confirm
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  submitModalVisible: false,
                });
              }}>
              Dismiss
            </Button>
          </Layout>
        </Card>
      </Modal>
    );
  }

  renderTopUpModal() {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={this.state.topUpModalVisible}>
        <Card style={{marginLeft: 15, marginRight: 15}}>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            You do not have enough in your wallet to make this request. Please
            proceed to top up your wallet to continue.
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  topUpModalVisible: false,
                });
                this.props.navigation.navigate('TopUpScreen');
              }}>
              Top Up
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  topUpModalVisible: false,
                });
              }}>
              Dismiss
            </Button>
          </Layout>
        </Card>
      </Modal>
    );
  }

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
        />
        <Text style={styles.header} category="h4">
          Make Request
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Card style={styles.card}>
              <Text style={styles.payLabel}>Amount</Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{marginTop: 10, marginRight: 5, fontWeight: 'bold'}}>
                  SGD
                </Text>
                <TextInput
                  keyboardType={'number-pad'}
                  style={styles.money}
                  value={this.state.amount}
                  onChangeText={(amount) =>
                    this.setState({amount: this.safeParseFloat(amount)})
                  }
                />
              </View>
            </Card>
            <Input
              label="Title"
              value={this.state.title}
              onChangeText={(title) => this.setState({title: title})}
            />
            <Input
              label="Description (Optional)"
              value={this.state.description}
              multiline={true}
              textStyle={{minHeight: 64, textAlignVertical: 'top'}}
              onChangeText={(description) =>
                this.setState({description: description})
              }
            />
            <Button style={styles.button} onPress={() => this.handleSubmit()}>
              Submit Request
            </Button>
            <Text style={styles.description} status="danger">
              {this.state.message}
            </Text>
            {this.renderSubmitModal()}
            {this.renderTopUpModal()}
          </Layout>
        </TouchableWithoutFeedback>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  header: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 30,
  },
  label: {
    fontSize: 14,
    marginBottom: 3,
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
  headerRow: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MakeRequest);
