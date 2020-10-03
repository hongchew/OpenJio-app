import React from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Image
} from 'react-native';
import {
  Button,
  Icon,
  Input,
  Text,
  Layout,
  Spinner,
} from '@ui-kitten/components';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {loginSuccess} from '../redux/actions';

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      email: null,
      password: null,
      name: null,
      message: '',
      isCreated: false,
    };
  }

  toggleSecureEntry = () => {
    if (this.state.secureTextEntry) {
      this.setState({
        secureTextEntry: false,
      });
    } else {
      this.setState({
        secureTextEntry: true,
      });
    }
  };

  renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={this.toggleSecureEntry}>
      <Icon name={this.state.secureTextEntry ? 'eye-off' : 'eye'} {...props} />
    </TouchableWithoutFeedback>
  );

  handleSignup = () => {
    if (
      this.state.email == null ||
      this.state.password == null ||
      this.state.name == null
    ) {
      this.setState({
        email: '',
        password: '',
        name: '',
        isCreated: false,
        message: 'Empty fields. Unable to create account.',
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
            <Image source={require('../img/openjioLogo.jpg')} style={{width: 70, height: 70}}/>
            <Text style={loginStyle.header} category='h1'>
              Sign Up 
            </Text>
          </Layout>
            
            <Input
              label="Email"
              value={this.state.email}
              onChangeText={(text) => this.setState({email: text})}
            />
            <Input
              label="Password"
              accessoryRight={this.renderIcon}
              secureTextEntry={this.state.secureTextEntry}
              value={this.state.password}
              onChangeText={(text) => this.setState({password: text})}
            />
            <Input
              label="Name"
              value={this.state.name}
              onChangeText={(text) => this.setState({name: text})}
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
