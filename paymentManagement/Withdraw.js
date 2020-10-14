import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  View,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput
} from 'react-native';
import {Text, Layout, Card, Button, Modal} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class Withdraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      withdrawAmount: 0,
      isUpdated: this.props.isUpdated,
      user: this.props.user,
      modalVisible: false,
    };
  }

  createTwoButtonAlert = (message) =>
    Alert.alert(
      'OpenJio',
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false}
    );

    showWithdrawModal() {
      if (this.state.withdrawAmount > 0) {
        this.setState({
          modalVisible: true
        })
      } else {
        this.setState({
          message: 'Withdraw amount field is empty.',
        })
      }
    }
  
    renderModal() {
      return (
        <Modal
          backdropStyle={styles.backdrop}
          visible={this.state.modalVisible}>
          <Card>
          <Text style={{textAlign: 'center'}}>Amount to withdraw:</Text> 
          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>SGD {this.state.withdrawAmount.toFixed(2)}</Text>
          
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({modalVisible: false});
                this.handleWithdraw();
              }}>
              Confirm
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({modalVisible: false, message: 'Withdrawal was Cancelled'});
              }}>
              Dismiss
            </Button>
          </Layout>
          </Card>
        </Modal>
      );
    }

  async handleWithdraw() {
    if (this.state.withdrawAmount === null) {
      this.setState({
        message: 'Withdraw amount field is empty.',
      });
    } else {
      try {
        //console.log(globalVariable.transactionApi + 'withdraw');
        //console.log(this.props.user.Wallet.walletId);
        //console.log(this.state.withdrawAmount);
        const response = await axios.post(
          globalVariable.transactionApi + 'withdraw',
          {
            walletId: this.props.user.Wallet.walletId,
            amount: this.state.withdrawAmount,
          }
        );
        //console.log(response.data);
        this.props.navigation.navigate('SuccessfulScreen', {
          amount: this.state.withdrawAmount,
          previousScreen: 'Withdraw'
        });
      } catch (error) {
        //console.log(error);
        this.setState({
          message: 'Withdrawal Failed.',
        });
      }
    }
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
          Withdraw
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Card style={styles.card}>
              <Text style={styles.payLabel}>Withdraw Amount</Text>
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
                    this.setState({withdrawAmount: parseFloat(amount)})
                  }
                />
              </View>
            </Card>

            <Button style={styles.button} onPress={() => this.showWithdrawModal()}>
              Withdraw
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
    fontWeight: 'bold'
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
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Withdraw);
