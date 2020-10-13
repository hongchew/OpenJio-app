import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StatusBar,
  Image,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Text, Layout, Card, Input, Button} from '@ui-kitten/components';
import axios from 'axios';

class MakePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
    };
  }

  render() {
    return (
      <Layout style={styles.layout}>
        <Text style={styles.header} category="h4">
          Payment
        </Text>
        {/* <Text style={styles.action}>Enter payment details:</Text> */}

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Input
              label="Amount in SGD"
              value={this.state.amountPayable}
              onChangeText={(amount) => this.setState({amountPayable: amount})}
            />
            <Input
              label="Recipient's Email"
              value={this.state.recipientEmail}
              onChangeText={(email) => this.setState({recipientEmail: email})}
            />
            
            <Text style={styles.balance}>Balance: {this.props.user.Wallet.balance}</Text>
            <Button
              style={styles.button}
              onPress={() => this.handleEditProfile()}>
              Pay
            </Button>
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
  header: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 30,
  },
  balance: {
    marginTop: 20,
    fontWeight: 'bold'
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MakePayment);
