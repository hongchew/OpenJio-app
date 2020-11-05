import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  StatusBar,
} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Input,
  Button,
  Modal,
  ListItem,
  Divider,
} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class EditRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      title: this.props.route.params.request.title,
      description: this.props.route.params.request.description,
      status: this.props.route.params.request.requestStatus,
      //string, so that it will be showed in <TextInput>
      amount: parseFloat(this.props.route.params.request.amount)
        .toFixed(2)
        .toString(),
      message: '',
      deleteModalVisible: false,
    };
    console.log(this.props.route.params.request.requestStatus);
  }

  correctAmountFormat() {
    if (this.state.amount <= 0) {
      return false;
    }
    const index = this.state.amount.indexOf('.');
    const numDp = this.state.amount.length - index - 1;
    if (index != -1 && numDp > 2) {
      return false;
    }
    return true;
  }

  async handleEditRequest() {
    if (this.state.title == '') {
      this.setState({
        message: 'Fields are empty, unable to proceed.',
      });
    } else if (!this.correctAmountFormat()) {
      this.setState({
        message: 'Invalid amount.',
      });
    } else if (this.state.amount > this.state.user.Wallet.balance) {
      this.setState({
        message: 'Amount exceeded balance.',
      });
    } else {
      try {
        const response = await axios.put(
          globalVariable.requestApi + 'update-request',
          {
            requestId: this.props.route.params.request.requestId,
            title: this.state.title,
            description: this.state.description,
            //change from string to float
            amount: parseFloat(this.state.amount),
          }
        );
        this.props.navigation.navigate('AnnouncementDetails', {
          userRequest: response.data,
        });
      } catch (error) {
        console.log(error);
        this.setState({
          message: 'Unable to update your request.',
        });
      }
    }
  }
  async handleDeleteRequest() {
    try {
      const response = await axios.delete(
        globalVariable.requestApi +
          'delete' +
          '/' +
          this.props.route.params.request.requestId
      );
      this.props.navigation.navigate('AnnouncementDetails', {
        userRequest: '',
      });
    } catch (e) {
      console.log(error);
      this.setState({
        message: 'Unable to delete your request.',
      });
    }
  }

  renderDeleteModal() {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={this.state.deleteModalVisible}>
        <Card>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            Are you sure you want to delete this request?
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({deleteModalVisible: false});
                this.handleDeleteRequest();
              }}>
              Confirm
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  deleteModalVisible: false,
                });
              }}>
              Dismiss
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
        <View style={styles.headerRow}>
          <Text style={styles.header} category="h4">
            Edit Request
          </Text>
          {this.state.status === 'DOING' ||
          this.state.status === 'SCHEDULED' ? null : (
            <Button
              style={styles.deleteButton}
              status="basic"
              onPress={() => this.setState({deleteModalVisible: true})}>
              Delete Request
            </Button>
          )}
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Card style={styles.card}>
              <Text style={styles.payLabel}>Amount</Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{marginTop: 10, marginRight: 5, fontWeight: 'bold'}}>
                  SGD
                </Text>
                <TextInput
                  keyboardType={'number-pad'}
                  style={styles.money}
                  value={this.state.amount}
                  onChangeText={(amount) =>
                    this.setState({
                      amount: amount,
                    })
                  }
                />
              </View>
            </Card>
            <Input
              label="Title"
              value={this.state.title}
              onChangeText={(title) => this.setState({title: title})}
            />
            <Input
              label="Description (Optional)"
              value={this.state.description}
              multiline={true}
              textStyle={{minHeight: 64, textAlignVertical: 'top'}}
              onChangeText={(description) =>
                this.setState({description: description})
              }
            />
            <Button
              style={styles.button}
              onPress={() => this.handleEditRequest()}>
              Update Request
            </Button>
            <Text style={styles.description} status="danger">
              {this.state.message}
            </Text>
            {this.renderDeleteModal()}
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
  card: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  header: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 30,
  },
  deleteButton: {
    marginTop: 20,
    height: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 3,
  },
  payLabel: {
    color: '#3366FF',
    fontSize: 14,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  money: {
    flexGrow: 1,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#3366FF',
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

export default connect(mapStateToProps)(EditRequest);
