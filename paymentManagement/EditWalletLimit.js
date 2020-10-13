import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Text, Layout, Input, Button} from '@ui-kitten/components';
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

  async handleAddLimit() {
    console.log(this.state.walletLimit);
    if (this.state.walletLimit === null) {
      this.setState({
        message: 'Wallet Limit field is empty. Unable to add wallet limit.',
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
        this.setState({
          message: 'Wallet Limit Added',
        });
        this.props.navigation.navigate('WalletLimit');
      } catch (error) {
        console.log(error);
        this.setState({
          message: 'Wallet Limit Addition Failed.',
        });
      }
      //   try {
      //     const response = await axios.post(globalVariable.addressApi + 'add', {
      //       userId: this.props.user.userId,
      //       address: {
      //         line1: this.state.line1,
      //         line2: this.state.line2,
      //         postalCode: this.state.postalCode,
      //         country: this.state.country,
      //         description: this.state.description,
      //       },
      //     });
      //     console.log(response.data);
      //     this.props.updateAddressArr(response.data);
      //     this.props.navigation.replace('Address');
      //   } catch (error) {
      //     console.log(error);
      //     this.setState({
      //       message: 'Unable to add address.',
      //     });
      //   }
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
          Add Wallet Limit
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <Layout style={styles.container}>
              <Input
                label="Wallet Limit"
                value={this.state.walletLimit}
                onChangeText={(text) => this.setState({walletLimit: text})}
              />
              <Button
                style={styles.button}
                onPress={() => this.handleAddLimit()}>
                ADD WALLET LIMIT
              </Button>
              {responseMessage}
            </Layout>
          </ScrollView>
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
