import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {
  Button,
  Icon,
  Input,
  Text,
  Layout,
  Spinner,
  Divider,
} from '@ui-kitten/components';
import {login} from '../redux/actions';
import loginStyle from '../styles/loginStyle';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      email: '',
      password: '',
      errorMessage: '',
    };
    console.log(this.props);
  }

  // componentDidMount() {
  //   if (this.props.user != null) {
  //     console.log('coming here');
  //     this.props.navigation.navigate('Tabs');
  //   } else {
  //     this.setState({
  //       email: '',
  //       password: '',
  //     });
  //   }
  // }

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

  handleLogin = () => {
    if (this.state.email != '' && this.state.password != '') {
      var loginDetails = {
        email: this.state.email,
        password: this.state.password,
      };
      this.props.login(loginDetails);

      //after calling login from redux action, should return a user
      //have to delay and wait for the redux props to be updated
      setTimeout(() => {
        if (this.props.user != null) {
          this.props.navigation.navigate('Tabs');
        } else {
          this.setState({
            email: '',
            password: '',
            errorMessage: 'Login failed, incorrect email/password',
          });
        }
      }, 800);
    } else {
      this.setState({
        email: '',
        password: '',
        errorMessage: 'Login failed, empty fields.',
      });
    }

    //console.log(this.props);
  };

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
            {this.props.isLoading && <Spinner />}
            <Text style={loginStyle.header} category="h1">
              OpenJio
            </Text>
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
    login: (loginDetails) => {
      dispatch(login(loginDetails));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
