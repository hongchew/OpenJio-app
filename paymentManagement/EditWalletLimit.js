import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {Text, Layout, Card, Button} from '@ui-kitten/components';
import {connect} from 'react-redux';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {setUser, updateWallet} from '../redux/actions';

class EditWalletLimit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isUpdated: this.props.isUpdated,
      walletLimit: this.props.user.Wallet.walletLimit,
    };
  }

  async handleEditLimit() {
    console.log(this.state.walletLimit);
    if (this.state.walletLimit === null) {
      this.setState({
        message: 'Wallet Limit field is empty. Unable to edit wallet limit.',
      });
    } else if (this.state.walletLimit <= 0) {
      this.setState({
        message:
          'Wallet Limit cannot be zero or negative. Please change the field',
      });
    } else {
      try {
        const response = await axios.put(
          globalVariable.walletApi + 'update-wallet-limit',
          {
            walletId: this.props.user.Wallet.walletId,
            walletLimit: this.state.walletLimit,
          }
        );
        console.log(response.data);
        this.props.updateWallet(response.data);
        this.props.navigation.navigate('WalletLimit');
      } catch (error) {
        console.log(error);
        this.setState({
          message: 'Wallet Limit Edition Failed.',
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
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <Text style={styles.header} category="h4">
          Edit Wallet Limit
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Card style={styles.card}>
              <Text style={styles.payLabel}>Limit Amount</Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{marginTop: 10, marginRight: 5, fontWeight: 'bold'}}>
                  SGD
                </Text>
                <TextInput
                  keyboardType={'number-pad'}
                  style={styles.money}
                  value={this.state.walletLimit}
                  onChangeText={(amount) =>
                    this.setState({walletLimit: parseFloat(amount)})
                  }
                />
              </View>
            </Card>

            <Button
              style={styles.button}
              onPress={() => this.handleEditLimit()}>
              EDIT WALLET LIMIT
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
  },
  container: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 30,
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
});

const mapStateToProps = (state) => {
  //   console.log(state);
  return {
    user: state.user,
    isUpdated: state.isUpdated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateWallet: (wallet) => {
      dispatch(updateWallet(wallet));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditWalletLimit);
