import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StatusBar,
  Image,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
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
  Icon,
} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {UserAvatar} from '../GLOBAL_VARIABLE';

class MakePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      amountPayable: '',
      recipientEmail: '',
      description: '',
      recipient: {},
      paymentModalVisible: false,
    };
  }

  async handleMakePayment() {
    try {
      const response = await axios.post(
        globalVariable.transactionApi + 'process-payment',
        {
          walletId: this.props.user.Wallet.walletId,
          amount: this.state.amountPayable,
          email: this.state.email,
          description: this.state.description,
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

  async getRecipient() {
    try {
      const response = await axios.get(
        globalVariable.userApi + this.state.recipientEmail
      );
      this.setState({
        recipient: response.data,
      });
    } catch (error) {
      console.log(error);
      this.setState({
        message: 'User does not exist.',
      });
    }

    if (this.state.recipientEmail == '' || this.state.amountPayable == '') {
      this.setState({
        message: 'Fields are empty, unable to proceed.',
      });
    } else if (this.state.recipient) {
      this.setState({
        paymentModalVisible: true,
      });
    } else {
      this.setState({
        paymentModalVisible: false,
      });
    }
  }

  renderPaymentModal() {
    const avatar = () => (
      <UserAvatar
        source={
          this.state.recipient.avatarPath
            ? this.state.recipient.avatarPath
            : null
        }
      />
    );
    const amountToDisplay = `SGD $${this.state.amountPayable}`;

    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={this.state.paymentModalVisible}
        onBackdropPress={() => this.setState({paymentModalVisible: false})}>
        <Card>
          <Text style={{fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>
            Review Payment
          </Text>
          <ListItem
            description={(evaProps) => (
              <Text {...evaProps} style={{fontSize: 17, fontWeight: 'bold'}}>
                {this.state.recipient.name}
              </Text>
            )}
            title={(evaProps) => (
              <Text {...evaProps} style={styles.label}>
                Recipient
              </Text>
            )}
            accessoryRight={avatar}
          />
          <Divider />
          <ListItem
            description={(evaProps) => (
              <Text {...evaProps} style={{fontSize: 17, fontWeight: 'bold'}}>
                {amountToDisplay}
              </Text>
            )}
            title={(evaProps) => (
              <Text {...evaProps} style={styles.label}>
                Pay Amount
              </Text>
            )}
          />
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({paymentModalVisible: false});
                //this.handleRemoveAvatar();
              }}>
              Confirm
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({paymentModalVisible: false});
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
        <Text style={styles.header} category="h4">
          Payment
        </Text>
        {/* <Text style={styles.action}>Enter payment details:</Text> */}

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Card style={styles.card}>
              <Text style={styles.label}>Pay Amount</Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{marginTop: 10, marginRight: 5, fontWeight: 'bold'}}>
                  SGD
                </Text>
                <TextInput
                  keyboardType={'decimal-pad'}
                  style={styles.amountInput}
                  value={this.state.amountPayable}
                  onChangeText={(amount) =>
                    this.setState({amountPayable: amount})
                  }
                />
              </View>
            </Card>
            <Input
              label="Recipient's Email"
              value={this.state.recipientEmail}
              onChangeText={(email) => this.setState({recipientEmail: email})}
            />
            <Input
              label="Description (Optional)"
              value={this.state.description}
              multiline={true}
              textStyle={{minHeight: 64}}
              onChangeText={(description) =>
                this.setState({description: description})
              }
            />

            <Text style={styles.balance}>
              Balance: SGD ${this.props.user.Wallet.balance}
            </Text>
            <Button style={styles.button} onPress={() => this.getRecipient()}>
              Next
            </Button>
            <Text style={styles.description} status="danger">
              {this.state.message}
            </Text>
            {this.renderPaymentModal()}
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
  header: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 30,
  },
  balance: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 3,
  },
  amountInput: {
    marginBottom: 5,
    flex: 1,
    borderColor: '#3366FF',
    borderBottomWidth: 1.0,
  },
  modalButton: {
    marginTop: 20,
    width: 120,
    margin: 5,
  },
  labelStyle: {
    fontSize: 17,
    marginLeft: 15,
  },
  headerRow: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MakePayment);
