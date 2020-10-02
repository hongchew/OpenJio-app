import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {Text, Icon, Layout, Input, Button} from '@ui-kitten/components';
import {connect} from 'react-redux';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class VerifyAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      userId: this.props.user.userId,
      nric: '',
      password: '',
      message: '',
      isUpdated: this.props.isUpdated,
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

  handleVerify = () => {
    if (this.state.name == '' || this.state.email == '') {
      this.setState({
        isUpdated: false,
        message: 'Name and email fields cannot be empty.',
      });
    } else {
      const user = {
        userId: this.props.user.userId,
        name: this.state.name,
        mobileNumber: this.state.mobileNumber,
        email: this.state.email,
      };
      this.props.editProfile(user);
      setTimeout(() => {
        if (this.props.isUpdated) {
          this.props.navigation.replace('Tabs', {screen: 'Profile'});
        } else {
          this.setState({
            message: 'Unable to update profile.',
          });
        }
      }, 500);
    }
  };

  render() {
    let responseMessage;
    if (this.state.isUpdated) {
      responseMessage = (
        <Text style={loginStyle.message} status='success'>
          {this.state.message}
        </Text>
      );
    } else {
      responseMessage = (
        <Text style={loginStyle.message} status='danger'>
          {this.state.message}
        </Text>
      );
    }

    return (
      <Layout style={loginStyle.layout}>
        <Layout style={styles.container}>
          <StatusBar
            barStyle='dark-content'
            hidden={false}
            backgroundColor='#ffffff'
            translucent={true}
          />
          <Layout style={styles.singpassLogo}>
            <Image source={require('../img/SingPassLogo.jpg')} />
          </Layout>
          <Text style={loginStyle.header} category='h4'>
            Log In
          </Text>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Layout>
              <Input
                label='NRIC'
                value={this.state.nric}
                onChangeText={(text) => this.setState({nric: text})}
              />
              <Input
                label='Password'
                accessoryRight={this.renderIcon}
                secureTextEntry={this.state.secureTextEntry}
                value={this.state.password}
                onChangeText={(text) => this.setState({password: text})}
              />

              <Button
                style={styles.button}
                status='danger'
                onPress={() => this.handleVerify()}>
                Login
              </Button>
              <Text style={loginStyle.message}>
                {`This page is a simulation of SingPass MyInfo verification`}
              </Text>
              {responseMessage}
            </Layout>
          </TouchableWithoutFeedback>
        </Layout>
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
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 40,
    justifyContent: 'center',
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
  singpassLogo: {
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
    isUpdated: state.isUpdated,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyAccount);
