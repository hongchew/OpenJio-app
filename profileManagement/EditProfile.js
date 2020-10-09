import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
} from 'react-native';
import {Text, Layout, Input, Button} from '@ui-kitten/components';
import {connect} from 'react-redux';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {setUser} from '../redux/actions';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      name: this.props.user.name,
      mobileNumber: this.props.user.mobileNumber,
      email: this.props.user.email,
      message: '',
      isUpdated: this.props.isUpdated,
    };
  }

  async handleEditProfile() {
    try {
      const response = await axios.put(
        globalVariable.userApi + 'update-user-details',
        {
          userId: this.props.user.userId,
          name: this.state.name,
          mobileNumber: this.state.mobileNumber,
          email: this.state.email,
        }
      );
      this.props.setUser(response.data);
      this.props.navigation.navigate('Tabs', {screen: 'Profile'});
    } catch (error) {
      console.log(error);
      this.setState({
        message: 'Unable to update profile.',
      });
    }
  }

  async handleRemoveAvatar() {
    try {
      const response = await axios.put(
        globalVariable.userApi + 'update-user-details',
        {
          userId: this.props.user.userId,
          avatarPath: null,
        }
      );
      this.props.setUser(response.data);
    } catch (error) {
      console.log(error);
      this.setState({
        message: 'Unable to remove avatar, please try again later.',
      });
    }
  }

  render() {
    let responseMessage;
    if (this.state.isUpdated) {
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
          Edit Profile
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Layout style={styles.avatar}>
              <Image
                resizeMethod={'auto'}
                resizeMode={'cover'}
                style={styles.image}
                source={
                  this.props.user && this.props.user.avatarPath
                    ? {
                        uri: `${
                          globalVariable.serverUrl
                        }${this.props.user.avatarPath.slice(1)}`,
                      }
                    : require('../img/defaultAvatar.png')
                }
              />
              <Button
                style={styles.pictureButton}
                size={'small'}
                appearance={'outline'}
                status={'primary'}>
                CHANGE AVATAR
              </Button>
              <Button
                onPress={() => this.handleRemoveAvatar()}
                style={styles.pictureButton}
                size={'small'}
                appearance={'outline'}
                status={'warning'}>
                REMOVE AVATAR
              </Button>
            </Layout>
            <Input
              label="Name"
              value={this.state.name}
              onChangeText={(text) => this.setState({name: text})}
            />
            <Input
              label="Email"
              value={this.state.email}
              onChangeText={(text) => this.setState({email: text})}
            />
            <Input
              label="Mobile No. (Optional)"
              value={this.state.mobileNumber}
              onChangeText={(text) => this.setState({mobileNumber: text})}
            />

            <Button
              style={styles.button}
              onPress={() => this.handleEditProfile()}>
              UPDATE PROFILE
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
    marginTop: 0,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
  },
  header: {
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 30,
  },
  avatar: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 999,
  },
  pictureButton: {
    marginTop: 8,
    width: 130,
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
