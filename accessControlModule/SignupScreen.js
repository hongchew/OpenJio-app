import React from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Image,
} from 'react-native';
import {Button, Icon, Input, Text, Layout} from '@ui-kitten/components';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry1: true,
      secureTextEntry2: true,
      email: '',
      password: '',
      reEnterPassword: '',
      name: '',
      message: '',
      isCreated: false,
    };
  }

  toggleSecureEntry1 = () => {
    if (this.state.secureTextEntry1) {
      this.setState({
        secureTextEntry1: false,
      });
    } else {
      this.setState({
        secureTextEntry1: true,
      });
    }
  };

  toggleSecureEntry2 = () => {
    if (this.state.secureTextEntry2) {
      this.setState({
        secureTextEntry2: false,
      });
    } else {
      this.setState({
        secureTextEntry2: true,
      });
    }
  };

  renderIcon1 = (props) => (
    <TouchableWithoutFeedback onPress={this.toggleSecureEntry1}>
      <Icon name={this.state.secureTextEntry1 ? 'eye-off' : 'eye'} {...props} />
    </TouchableWithoutFeedback>
  );

  renderIcon2 = (props) => (
    <TouchableWithoutFeedback onPress={this.toggleSecureEntry2}>
      <Icon name={this.state.secureTextEntry2 ? 'eye-off' : 'eye'} {...props} />
    </TouchableWithoutFeedback>
  );

  handleSignup = () => {
    const emptyFields =
      this.state.email == '' ||
      this.state.password == '' ||
      this.state.name == '' ||
      this.state.reEnterPassword == '';
    const unmatchedPasswords =
      this.state.password != this.state.reEnterPassword;
    if (emptyFields || unmatchedPasswords) {
      this.setState({
        email: '',
        password: '',
        reEnterPassword: '',
        name: '',
        isCreated: false,
        message: emptyFields
          ? 'Empty fields. Unable to create account.'
          : 'Passwords do not match',
      });
    } else {
      axios
        .post(globalVariable.userApi + 'signup', {
          email: this.state.email,
          password: this.state.password,
          name: this.state.name,
        })
        .then((response) => {
          this.setState({
            email: '',
            password: '',
            reEnterPassword: '',
            name: '',
            isCreated: true,
            message: 'Account created successfully.',
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            email: '',
            password: '',
            reEnterPassword: '',
            name: '',
            isCreated: false,
            message: 'Unable to create account.',
          });
        });
    }
  };

  render() {
    let responseMessage;
    if (this.state.isCreated) {
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
      <Layout style={loginStyle.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={loginStyle.container}>
            <Layout style={styles.logo}>
              <Image
                source={require('../img/openjioLogo.jpg')}
                style={{width: 70, height: 70}}
              />
              <Text style={loginStyle.header} category="h1">
                Sign Up
              </Text>
            </Layout>

            <Input
              label="Email"
              value={this.state.email}
              onChangeText={(text) => this.setState({email: text})}
            />
            <Input
              label="Name"
              value={this.state.name}
              onChangeText={(text) => this.setState({name: text})}
            />
            <Input
              label="Password"
              accessoryRight={this.renderIcon1}
              secureTextEntry={this.state.secureTextEntry1}
              value={this.state.password}
              onChangeText={(text) => this.setState({password: text})}
            />
            <Input
              label="Re-Enter Password"
              accessoryRight={this.renderIcon2}
              secureTextEntry={this.state.secureTextEntry2}
              value={this.state.reEnterPassword}
              onChangeText={(text) => this.setState({reEnterPassword: text})}
            />

            <Button
              style={loginStyle.login}
              onPress={() => this.handleSignup()}>
              SIGN UP
            </Button>

            {responseMessage}

            <TouchableOpacity
              style={loginStyle.touchableLink}
              onPress={() => this.props.navigation.replace('Login')}>
              <Text style={loginStyle.signupLink}>
                <Text>Have an account? </Text>
                <Text status="primary">Login here.</Text>
              </Text>
            </TouchableOpacity>
          </Layout>
        </TouchableWithoutFeedback>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  //define styles that is specific to only this page
  logo: {
    alignItems: 'center',
  },
});

export default SignupScreen;
