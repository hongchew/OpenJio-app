import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import {Text, Layout, Input, Button, Modal, Card} from '@ui-kitten/components';
import {connect} from 'react-redux';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {setUser} from '../redux/actions';
import ImagePicker from 'react-native-image-picker';

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
      newAvatar: null,
      removeAvatarModalVisible: false,
      changeAvatarModalVisible: false,
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

  handlePickImage() {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, async (picture) => {
      if (picture.uri) {
        this.setState({newAvatar: picture}, () => {
          this.setState({changeAvatarModalVisible: true});
        });
      } else {
        console.log(picture);
        return;
      }
    });
  }

  async handleChangeAvatar() {
    try {
      const data = new FormData();
      data.append('avatar', {
        name: this.state.newAvatar.fileName,
        type: this.state.newAvatar.type,
        uri:
          Platform.OS === 'android'
            ? this.state.newAvatar.uri
            : this.state.newAvatar.uri.replace('file://', ''),
      });
      const response = await axios.post(
        globalVariable.userApi + `upload-avatar/${this.props.user.userId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response);
      this.setState({message: '', newAvatar: null});
      this.props.setUser(response.data.user);
    } catch (error) {
      console.log(error);
      this.setState({
        message: 'Unable to change avatar.',
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

  renderModals() {
    if (this.state.removeAvatarModalVisible) {
      return (
        <Modal
          backdropStyle={styles.backdrop}
          visible={this.state.removeAvatarModalVisible}
          onBackdropPress={() =>
            this.setState({removeAvatarModalVisible: false})
          }>
          <Card>
            <Text> Are you sure you want to remove your avatar?</Text>
            <Layout style={styles.modalButtonsContainer}>
              <Button
                style={styles.modalButton}
                size={'small'}
                onPress={() => {
                  this.setState({removeAvatarModalVisible: false});
                  this.handleRemoveAvatar();
                }}>
                Remove
              </Button>
              <Button
                appearance={'outline'}
                style={styles.modalButton}
                size={'small'}
                onPress={() => {
                  this.setState({removeAvatarModalVisible: false});
                }}>
                Dismiss
              </Button>
            </Layout>
          </Card>
        </Modal>
      );
    } else if (this.state.changeAvatarModalVisible) {
      return (
        <Modal
          backdropStyle={styles.backdrop}
          visible={this.state.changeAvatarModalVisible}
          onBackdropPress={() =>
            this.setState({changeAvatarModalVisible: false})
          }>
          <Card>
            <Layout style={styles.changeAvatarPreview}>
              <Text> Change avatar to this picture?</Text>
              <Image
                style={styles.image}
                source={{uri: this.state.newAvatar.uri}}
              />
            </Layout>
            <Layout style={styles.modalButtonsContainer}>
              <Button
                style={styles.modalButton}
                size={'small'}
                onPress={() => {
                  this.setState({changeAvatarModalVisible: false});
                  this.handleChangeAvatar();
                }}>
                Change
              </Button>
              <Button
                appearance={'outline'}
                style={styles.modalButton}
                size={'small'}
                onPress={() => {
                  this.setState({changeAvatarModalVisible: false});
                }}>
                Dismiss
              </Button>
            </Layout>
          </Card>
        </Modal>
      );
    } else {
      return null;
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
                onPress={() => this.handlePickImage()}
                style={styles.pictureButton}
                size={'small'}
                appearance={'outline'}
                status={'primary'}>
                CHANGE AVATAR
              </Button>
              <Button
                onPress={() => {
                  this.props.user && this.props.user.avatarPath
                    ? this.setState({removeAvatarModalVisible: true})
                    : this.setState({message: 'No avatar to remove.'});
                }}
                style={styles.pictureButton}
                size={'small'}
                appearance={'outline'}
                status={'warning'}>
                REMOVE AVATAR
              </Button>
              {this.renderModals()}
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
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 999,
  },
  pictureButton: {
    marginTop: 8,
    width: 130,
  },
  modalButton: {
    marginTop: 20,
    width: 120,
    margin: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  changeAvatarPreview: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
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
