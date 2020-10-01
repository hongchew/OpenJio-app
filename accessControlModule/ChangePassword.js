import React from 'react';
import {StatusBar, TouchableWithoutFeedback, Keyboard, StyleSheet} from 'react-native';
import {Text, Icon, Layout, Input, Button} from '@ui-kitten/components';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      email: '',
      currPassword: '',
      newPassword: '',
      isChanged: false,
      message: '',
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

  handleChangePassword = () => {
    if (
      this.state.email == '' ||
      this.state.currPassword == '' ||
      this.state.newPassword == ''
    ) {
      this.setState({
        email: '',
        currPassword: '',
        newPassword: '',
        isChanged: false,
        message: 'Empty fields. Unable to change password.',
      });
    } else {
      axios
        .put(globalVariable.apiUrl + 'change-user-password', {
          email: this.state.email,
          currPassword: this.state.currPassword,
          newPassword: this.state.newPassword,
        })
        .then((response) => {
          this.setState({
            email: '',
            currPassword: '',
            newPassword: '',
            isChanged: true,
            message: 'Password changed successfully.',
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            email: '',
            currPassword: '',
            newPassword: '',
            isChanged: false,
            message: 'Unable to change password.',
          });
        });
    }
  };

  render() {
    let responseMessage;
    if (this.state.isChanged) {
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
          Change Password
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Input
              label="Email"
              value={this.state.email}
              onChangeText={(text) => this.setState({email: text})}
            />
            <Input
              label="Current Password"
              accessoryRight={this.renderIcon}
              secureTextEntry={this.state.secureTextEntry}
              value={this.state.currPassword}
              onChangeText={(text) => this.setState({currPassword: text})}
            />
            <Input
              label="New Password"
              value={this.state.name}
              accessoryRight={this.renderIcon}
              secureTextEntry={this.state.secureTextEntry}
              value={this.state.newPassword}
              onChangeText={(text) => this.setState({newPassword: text})}
            />
            <Button
              style={styles.button}
              onPress={() => this.handleChangePassword()}>
              CHANGE PASSWORD
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

export default ChangePassword;
