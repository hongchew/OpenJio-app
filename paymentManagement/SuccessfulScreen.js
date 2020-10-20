import React from 'react';
import {connect} from 'react-redux';
import {View, Image, StyleSheet} from 'react-native';
import {Text, Layout, Button} from '@ui-kitten/components';

class SuccessfulScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //getting params here
      amount: this.props.route.params.amount,
      recipientName: '',
      previousScreen: this.props.route.params.previousScreen,
    };
  }

  componentDidMount() {
    if (this.state.previousScreen === 'MakePayment') {
      this.setState({
        recipientName: this.props.route.params.recipientName,
      });
    } 
  }

  renderSuccessfulWithdraw() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../img/success.png')} />
        <Text style={styles.header} category="h5">
          Withdrawal Successful!
        </Text>
        <Text style={styles.description}>
          You have withdrawn SGD {this.state.amount.toFixed(2)}
        </Text>
        <Text style={styles.description}>
          You can view the withdrawal details in the transaction history.
        </Text>
      </View>
    );
  }

  renderSuccessfulDonation() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../img/openjioLogo.jpg')}
        />
        <Text style={styles.header} category="h5">
          Thank you for your kind donation!
        </Text>
        <Text style={styles.description}>
          You have donated SGD {this.state.amount.toFixed(2)}
        </Text>
        <Text style={styles.description}>
          You can view the donation details in the transaction history.
        </Text>
      </View>
    );
  }

  renderSuccessfulPayment() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../img/success.png')} />
        <Text style={styles.header} category="h5">
          Payment Successful!
        </Text>
        <Text style={styles.description}>
          You have paid SGD {this.state.amount.toFixed(2)} to {this.state.recipientName}
        </Text>
        <Text style={styles.description}>
          You can view the payment details in the transaction history.
        </Text>
      </View>
    );
  }

  render() {
    return (
      <Layout style={styles.layout}>
        {this.state.previousScreen === 'Withdraw'
          ? this.renderSuccessfulWithdraw()
          : null}
        {this.state.previousScreen === 'Donate'
          ? this.renderSuccessfulDonation()
          : null}
        {this.state.previousScreen === 'MakePayment'
          ? this.renderSuccessfulPayment()
          : null}
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
  header: {
    textAlign: 'center',
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

export default connect(mapStateToProps)(SuccessfulScreen);
