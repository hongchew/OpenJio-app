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

class Donate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      message: '',
      donationAmount: null,
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

  async handleDonation() {
    if (this.state.donationAmount === null) {
      this.setState({
        message: 'Donation amount field is empty',
      });
    } else {
      try {
        console.log(globalVariable.transactionApi + 'donate');
        console.log(this.props.user.Wallet.walletId);
        console.log(this.state.donationAmount);
        const response = await axios.post(
          globalVariable.transactionApi + 'donate',
          {
            walletId: this.props.user.Wallet.walletId,
            amount: this.state.donationAmount,
          }
        );
        console.log(response.data);
        this.createTwoButtonAlert('Thank you for your kind donation!');
        this.props.navigation.replace('Tabs', {screen: 'Wallet'});
      } catch (error) {
        console.log(error);
        this.setState({
          message: 'Donation Failed.',
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
          Donate
        </Text>
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
                    this.setState({donationAmount: parseFloat(amount)})
                  }
                />
              </View>
            </Card>

            <Button style={styles.button} onPress={() => this.handleDonation()}>
              Donate
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

export default connect(mapStateToProps)(Donate);
