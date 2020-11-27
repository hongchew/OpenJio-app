import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import {Text, Layout, Card, Input, Button, Modal} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class ReportScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      request: this.props.route.params.request,
      description: '',
      message: '',
      submitModalVisible: false,
      successModalVisible: false,
    };
  }

  async handleSubmit() {
    try {
      await axios.post(globalVariable.complaintApi + 'create-complaint', {
        description: this.state.description,
        requestId: this.state.request.requestId,
        complainerUserId: this.props.user.userId,
      });
      this.setState({
        submitModalVisible: false,
        successModalVisible: true,
      });
    } catch (error) {
      console.log(error);
      this.setState({
        message: 'Unable to submit.',
      });
    }
  }

  showSubmitModel() {
    if (this.state.description == '') {
      this.setState({
        message: 'Fields are empty, unable to proceed.',
      });
    } else {
      this.setState({
        //if it passes all the checks, show the modal
        submitModalVisible: true,
      });
    }
  }

  renderSubmitModal() {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={this.state.submitModalVisible}>
        <Card>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            Are you sure you want to submit this issue?
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({submitModalVisible: false});
                this.handleSubmit();
              }}>
              Confirm
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  submitModalVisible: false,
                });
              }}>
              Dismiss
            </Button>
          </Layout>
        </Card>
      </Modal>
    );
  }

  renderSuccessModal() {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={this.state.successModalVisible}>
        <Card style={{marginLeft: 20, marginRight: 20}}>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            Thank you for notifying us. We will get back to you soon.
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({successModalVisible: false});
                this.state.request.userId === this.props.user.userId ?
                this.props.navigation.navigate('MyRequest', {
                  requestId: this.state.request.requestId,
                }):
                this.props.navigation.navigate('RequestDetails', {
                  requestId: this.state.request.requestId,
                });
              }}>
              Go back
            </Button>
          </Layout>
        </Card>
      </Modal>
    );
  }

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
        />
        <Text style={styles.header} category="h4">
          Report an Issue
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Input
              label="What issues did you face with this request?"
              value={this.state.description}
              multiline={true}
              textStyle={{minHeight: 100, textAlignVertical: 'top'}}
              onChangeText={(description) =>
                this.setState({description: description})
              }
            />
            <Button
              style={styles.button}
              onPress={() => this.showSubmitModel()}>
              Submit
            </Button>
            <Text style={styles.description} status="danger">
              {this.state.message}
            </Text>
            {this.renderSubmitModal()}
            {this.renderSuccessModal()}
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
  button: {
    marginTop: 30,
  },
  header: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: 'Karla-Bold',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    marginTop: 20,
    width: 120,
    margin: 5,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(ReportScreen);
