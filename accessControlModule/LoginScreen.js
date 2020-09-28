import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  Button,
  Icon,
  Input,
  Text,
  Layout,
  Spinner,
} from '@ui-kitten/components';
import {login} from '../redux/actions';

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

  handleLogin = () => {
    var loginDetails = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.login(loginDetails);

    //after calling login from redux action, should return a user
    //have to delay and wait for the redux props to be updated
    setTimeout(() => {
      if (this.props.user != null) {
        this.props.navigation.navigate('Home');
      } else {
        this.setState({
          email: '',
          password: '',
          errorMessage: 'Login failed, incorrect email/password',
        });
      }
    }, 800);

    //console.log(this.props);
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            {this.props.isLoading && <Spinner />}
            <Text style={styles.header} category="h1">
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
            <Button style={styles.login} onPress={() => this.handleLogin()}>
              LOGIN
            </Button>
            <Button style={styles.login} status="warning">
              SIGN UP
            </Button>
            <Text style={styles.errorMessage} status="danger">
              {this.state.errorMessage}
            </Text>
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
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 20,
    fontFamily: 'Karla-Bold',
  },
  login: {
    marginTop: 20,
  },
  errorMessage: {
    marginTop: 20,
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  console.log(state);
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
