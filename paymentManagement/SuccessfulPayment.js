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
  TextInput,
} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Button,
  Modal,
  ListItem,
  Divider,
  Icon,
} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {UserAvatar} from '../GLOBAL_VARIABLE';

class SuccessfulPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      //getting the transaction details here
      recipientName: this.props.route.params.recipientName,
      amount: this.props.route.params.transactionDetails.amount,
    };
  }

  render() {
    return (
      <Layout style={styles.layout}>
        {/* <Text style={styles.action}>Enter payment details:</Text> */}

        <View style={styles.container}>
          <Image style={styles.image} source={require('../img/success.png')} />
          <Text style={styles.header} category="h5">
            Payment Successful!
          </Text>
          <Text style={styles.description}>
            You have paid SGD {this.state.amount} to {this.state.recipientName}
          </Text>
          <Text style={styles.description}>
            You can view the payment details in transaction history.
          </Text>
        </View>
        <Button
          style={styles.modalButton}
          onPress={() => {
            this.props.navigation.replace('Tabs', {screen: 'Wallet'});
          }}>
          Back to Wallet
        </Button>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginLeft: 30,
    marginRight: 30,
  },
  image: {
    marginBottom: 20,
    width: 80,
    height: 80,
  },
  description: {
    marginTop: 20,
    textAlign: 'center',
  },
  modalButton: {
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 20,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(SuccessfulPayment);
