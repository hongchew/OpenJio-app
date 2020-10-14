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
import {Text, Layout, Card, Button} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class Withdraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      withdrawAmount: null,
      isUpdated: this.props.isUpdated,
      user: this.props.user,
    };
  }

  createTwoButtonAlert = (message) =>
    Alert.alert(
      'OpenJio',
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false}
    );

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
        this.createTwoButtonAlert(
          'You have withdrawn ' + this.state.withdrawAmount
        );
        this.props.navigation.replace('Tabs', {screen: 'Wallet'});
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

            <Button style={styles.button} onPress={() => this.handleWithdraw()}>
              Withdraw
            </Button>
            {responseMessage}
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
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Withdraw);
