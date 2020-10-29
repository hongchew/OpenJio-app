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
import {Text, Layout, Card, Input, Button} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class MakeRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      title: '',
      description: '',
      amount: 0,
      message: '',
      //   announcementId: this.props.routes.params.announcementId,
    };
  }

  async handleMakeRequest() {
    if (this.state.title == '' || this.state.description == '') {
      this.setState({
        message: 'Fields are empty, unable to proceed.',
      });
    } else if (this.state.amount <= 0) {
      this.setState({
        message: 'Invalid amount.',
      });
    } else if (this.state.amount > this.state.user.Wallet.balance) {
      this.setState({
        message: 'Amount exceeded balance.',
      });
    } else {
      try {
        //   const response = await axios.post(globalVariable.requestsApi + '');
      } catch (error) {
        //   console.log(error);
        this.setState({
          message: 'Unable to make a request.',
        });
      }
    }
  }

  //this method prevents returning NaN when Input has empty text
  safeParseFloat = (str) => {
    const value = Number.parseFloat(str);
    return Number.isNaN(value) ? 0 : value;
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
        />
        <Text style={styles.header} category="h4">
          Make Request
        </Text>
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
                    this.setState({amount: this.safeParseFloat(amount)})
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
              label="Description"
              value={this.state.description}
              multiline={true}
              textStyle={{minHeight: 64, textAlignVertical: 'top'}}
              onChangeText={(description) =>
                this.setState({description: description})
              }
            />
            <Button
              style={styles.button}
              onPress={() => this.handleMakeRequest()}>
              Next
            </Button>
            <Text style={styles.description} status="danger">
              {this.state.message}
            </Text>
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
  headerRow: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MakeRequest);
