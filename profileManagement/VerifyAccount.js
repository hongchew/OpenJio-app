import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
} from 'react-native';
import {Text, Icon, Layout, Input, Button} from '@ui-kitten/components';
import {connect} from 'react-redux';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {setUser} from '../redux/actions';

class VerifyAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      userId: this.props.user.userId,
      nric: '',
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

  handleVerify = async () => {
    if (this.state.nric === '' || this.state.password === '') {
      this.setState({
        isUpdated: false,
        errorMessage: 'NRIC or Password cannot be empty.',
      });
    } else {
      try {
        const response = await axios.put(
          globalVariable.userApi + 'verify-user-singpass',
          {
            userId: this.state.userId,
            nric: this.state.nric,
            password: this.state.password,
          }
        );
        console.log(response.data);
        this.props.setUser(response.data);
        this.props.navigation.replace('Tabs', {screen: 'Profile'});
      } catch (error) {
        console.log(error);
        this.setState({
          nric: '',
          password: '',
          errorMessage:
            'SingPass MyInfo verification failed, please try again.',
        });
      }
    }
  };

  render() {
    return (
      <Layout style={loginStyle.layout}>
        <Layout style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor="#ffffff"
            translucent={true}
          />
          <Layout style={styles.singpassLogo}>
            <Image source={require('../img/SingPassLogo.jpg')} />
          </Layout>
          <Text style={loginStyle.header} category="h4">
            Log In
          </Text>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Layout>
              <Input
                label="NRIC"
                value={this.state.nric}
                onChangeText={(text) => this.setState({nric: text})}
              />
              <Input
                label="Password"
                accessoryRight={this.renderIcon}
                secureTextEntry={this.state.secureTextEntry}
                value={this.state.password}
                onChangeText={(text) => this.setState({password: text})}
              />

              <Button
                style={styles.button}
                status="danger"
                onPress={() => this.handleVerify()}>
                Login
              </Button>
              <Text style={loginStyle.message}>
                {`This page is a simulation of SingPass MyInfo verification`}
              </Text>
              <Text style={loginStyle.message} status="danger">
                {this.state.errorMessage}
              </Text>
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
  };
};

export default connect(mapStateToProps, {setUser})(VerifyAccount);
