import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {Text, Icon, Layout, Input, Button} from '@ui-kitten/components';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextCurr: true,
      secureTextNew: true,
      secureTextNew2: true,
      email: '',
      currPassword: '',
      newPassword: '',
      reEnterNewPassword: '',
      isChanged: false,
      message: '',
    };
  }

  toggleSecureCurr = () => {
    if (this.state.secureTextCurr) {
      this.setState({
        secureTextCurr: false,
      });
    } else {
      this.setState({
        secureTextCurr: true,
      });
    }
  };

  toggleSecureNew = () => {
    if (this.state.secureTextNew) {
      this.setState({
        secureTextNew: false,
      });
    } else {
      this.setState({
        secureTextNew: true,
      });
    }
  };

  toggleSecureNew2 = () => {
    if (this.state.secureTextNew2) {
      this.setState({
        secureTextNew2: false,
      });
    } else {
      this.setState({
        secureTextNew2: true,
      });
    }
  };

  renderCurrIcon = (props) => (
    <TouchableWithoutFeedback onPress={this.toggleSecureCurr}>
      <Icon name={this.state.secureTextCurr ? 'eye-off' : 'eye'} {...props} />
    </TouchableWithoutFeedback>
  );

  renderNewIcon = (props) => (
    <TouchableWithoutFeedback onPress={this.toggleSecureNew}>
      <Icon name={this.state.secureTextNew ? 'eye-off' : 'eye'} {...props} />
    </TouchableWithoutFeedback>
  );

  renderNewIcon2 = (props) => (
    <TouchableWithoutFeedback onPress={this.toggleSecureNew2}>
      <Icon name={this.state.secureTextNew2 ? 'eye-off' : 'eye'} {...props} />
    </TouchableWithoutFeedback>
  );

  handleChangePassword = () => {
    let emptyFields;

    if (this.props.route.params.fromLogin) {
      emptyFields =
        this.state.newPassword == '' || this.state.reEnterNewPassword == '';
    } else {
      emptyFields =
        this.state.email == '' ||
        this.state.currPassword == '' ||
        this.state.newPassword == '' ||
        this.state.name == '' ||
        this.state.reEnterNewPassword == '';
    }
    const unmatchedPasswords =
      this.state.newPassword != this.state.reEnterNewPassword;
    if (emptyFields || unmatchedPasswords) {
      this.setState({
        email: '',
        currPassword: '',
        newPassword: '',
        reEnterNewPassword: '',
        isChanged: false,
        message: emptyFields
          ? 'Empty fields. Unable to change password.'
          : 'New Passwords do not match',
      });
    } else {
      axios
        .put(globalVariable.userApi + 'change-user-password', {
          email: this.props.route.params.fromLogin
            ? this.props.route.params.email
            : this.state.email,
          currPassword: this.props.route.params.fromLogin
            ? this.props.route.params.currPassword
            : this.state.currPassword,
          newPassword: this.state.newPassword,
        })
        .then((response) => {
          this.setState({
            email: '',
            currPassword: '',
            newPassword: '',
            reEnterNewPassword: '',
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
            reEnterNewPassword: '',
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
            {/* don't render if user came from login page */}
            {!this.props.route.params.fromLogin && (
              <Input
                label="Email"
                value={this.state.email}
                onChangeText={(text) => this.setState({email: text})}
              />
            )}
            {/* don't render if user came from login page */}
            {!this.props.route.params.fromLogin && (
              <Input
                label="Current Password"
                accessoryRight={this.renderCurrIcon}
                secureTextEntry={this.state.secureTextCurr}
                value={this.state.currPassword}
                onChangeText={(text) => this.setState({currPassword: text})}
              />
            )}
            <Input
              label="New Password"
              value={this.state.name}
              accessoryRight={this.renderNewIcon}
              secureTextEntry={this.state.secureTextNew}
              value={this.state.newPassword}
              onChangeText={(text) => this.setState({newPassword: text})}
            />
            <Input
              label="Re-Enter New Password"
              value={this.state.name}
              accessoryRight={this.renderNewIcon2}
              secureTextEntry={this.state.secureTextNew2}
              value={this.state.reEnterNewPassword}
              onChangeText={(text) => this.setState({reEnterNewPassword: text})}
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
