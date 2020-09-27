import React from 'react';
import { connect } from 'react-redux';
import {
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Icon, Input, Text, Layout} from '@ui-kitten/components';
import axios from 'axios';
import { login } from '../redux/actions/AccessActions';
import { bindActionCreators } from 'redux';

const apiUrl = "http://10.0.2.2:3000/users/";

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      email: '',
      password: '',
      user: null
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
    // axios.post(apiUrl + 'login', {
    //   email: this.state.email,
    //   password: this.state.password
    // })
    // .then(function (response) {
    //   this.setState({
    //     user: response 
    //   })
    //   console.log('Login successfully: ' + response); 
    // })
    // .catch(function (error) {
    //   console.log('Failed to login: ' + error);
    // });
    this.props.login(this.state.email, this.state.password);
  }

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
            <Text style={styles.header} category="h1">
              OpenJio
            </Text>
            <Input label="Email" 
              value={this.state.email}
              onChangeText={(text) => this.setState({ email: text })}
            />
            <Input
              label="Password"
              accessoryRight={this.renderIcon}
              secureTextEntry={this.state.secureTextEntry}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
            />
            <Button style={styles.login} onPress={() => this.handleLogin()}>LOGIN</Button>
            <Button style={styles.login} status="warning">
              SIGN UP
            </Button>
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
});

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.accessReducer.isLoggedIn
  };
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    login,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
