import React from 'react';
import {StatusBar, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Text, Layout, Input, Button} from '@ui-kitten/components';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: '',
      isVerified: false,
    };
  }

  handleResetPassword = () => {
    if (this.state.email == null) {
      this.setState({
        email: '',
        isVerified: false,
        message: 'Empty field. Unable to verify email.',
      });
    } else {
      axios
        .post(globalVariable.apiUrl + 'reset-user-password', {
          email: this.state.email,
        })
        .then((response) => {
          this.setState({
            email: '',
            isVerified: true,
            message: 'An email has been sent to you to reset your password.',
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            email: '',
            isVerified: false,
            message: 'Unable to verify email.',
          });
        });
    }
  };

  render() {
    let responseMessage;
    if (this.state.isVerified) {
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
          Forgot Password
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Input
              label="Email"
              value={this.state.email}
              onChangeText={(text) => this.setState({email: text})}
            />
            <Button
              style={styles.button}
              onPress={() => this.handleResetPassword()}>
              SEND PASSWORD RESET EMAIL
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
});

export default ForgotPassword;
