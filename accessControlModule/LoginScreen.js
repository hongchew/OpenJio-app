import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Image,
} from 'react-native';
import {
  Button,
  Icon,
  Input,
  Text,
  Layout,
} from '@ui-kitten/components';
import {setUser} from '../redux/actions';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      email: '',
      password: '',
      errorMessage: '',
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

  async handleLogin() {
    try {
      const response = await axios.post(globalVariable.userApi + 'login', {
        email: this.state.email,
        password: this.state.password,
      });
      console.log(response.data);

      // 1st login, check if account is validated
      // (isPasswordReset: false, isValidated: false)
      if (!response.data.isValidated) {
        this.setState({
          email: '',
          password: '',
          errorMessage:
            'Your account is not verified, please verify your account first.',
        });
      }
      // subsequent logins, check if user had just reset their password
      // (isPasswordReset: true, isValidated: true)
      else if (response.data.isPasswordReset) {
        this.props.navigation.navigate('ChangePassword', {
          fromLogin: true,
          email: this.state.email,
          currPassword: this.state.password,
        });
      }
      // (isPasswordReset: false, isValidated: true)
      else {
        this.props.setUser(response.data);
        this.props.navigation.navigate('Tabs');
      }
    } catch (error) {
      this.setState({
        email: '',
        password: '',
        errorMessage: 'Login failed, please try again.',
      });
    }
  }

  render() {
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
                OpenJio
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
            <TouchableOpacity
              style={styles.link}
              onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              <Text style={loginStyle.link} status="primary">
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <Button style={loginStyle.login} onPress={() => this.handleLogin()}>
              LOGIN
            </Button>

            {/* <Divider style={loginStyle.divider}/> */}

            <Text style={loginStyle.message} status="danger">
              {this.state.errorMessage}
            </Text>
            <TouchableOpacity
              style={loginStyle.touchableLink}
              onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={loginStyle.signupLink}>
                <Text>Don't have an account? </Text>
                <Text status="primary">Sign up here.</Text>
              </Text>
            </TouchableOpacity>
          </Layout>
        </TouchableWithoutFeedback>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  //define styles that is only specific to this page
  link: {
    width: '40%',
    //to force it to the right
    alignSelf: 'flex-end',
  },
  logo: {
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
    error: state.error,
    isLoading: state.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
