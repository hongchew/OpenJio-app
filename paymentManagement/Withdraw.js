import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StatusBar,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Text, Layout, Card, Input, Button} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import loginStyle from '../styles/loginStyle';

class Withdraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
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
        console.log(globalVariable.transactionApi + 'withdraw');
        console.log(this.props.user.Wallet.walletId);
        console.log(this.state.withdrawAmount);
        const response = await axios.post(
          globalVariable.transactionApi + 'withdraw',
          {
            walletId: this.props.user.Wallet.walletId,
            amount: this.state.withdrawAmount,
          }
        );
        console.log(response.data);
        this.createTwoButtonAlert(
          'You have withdrawn ' + this.state.withdrawAmount
        );
        this.props.navigation.replace('Tabs', {screen: 'Wallet'});
      } catch (error) {
        console.log(error);
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
        <Text style={loginStyle.message} status="success">
          {this.state.message}
        </Text>
      );
    } else {
      responseMessage = (
        <Text style={loginStyle.message} status="danger">
          {this.state.message}
        </Text>
      );
    }

    return (
      <Layout style={styles.layout}>
        <Text style={styles.header} category="h4">
          Withdraw
        </Text>
        <ScrollView style={styles.container}>
          <Card>
            <Text style={styles.action}>Enter Withdraw Amount:</Text>
            <Input
              label="Amount"
              value={this.state.withdrawAmount}
              onChangeText={(amount) => this.setState({withdrawAmount: amount})}
            />

            <Button style={styles.button} onPress={() => this.handleWithdraw()}>
              Withdraw
            </Button>
            {responseMessage}
          </Card>
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 2,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  card: {
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 5,
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
  },
  action: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  money: {
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
  link: {
    textAlign: 'right',
    marginTop: 10,
  },
  transaction: {
    marginTop: 20,
    marginBottom: 20,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Withdraw);
