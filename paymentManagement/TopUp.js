import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StatusBar,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Text, Layout, Card} from '@ui-kitten/components';
import axios from 'axios';

class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      amountPayable: 0,
      recipientEmail: '',
    };
  }

  //Retrieve wallet balance of user
  async getBalance (userId) {
    try {
      //retrieve user wallet info by userId
      //const wallet = axios.get('')
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <Layout style={styles.layout}>
        <Text style={styles.header} category="h4">
          Top Up 
        </Text>
        <ScrollView style={styles.container}>
          <Card>
            <Text style={styles.action}>Enter Payment Details:</Text>
            <Input
              label="Amount"
              value={this.state.amountPayable}
              onChangeText={(amount) => this.setState({amountPayable: amount})}
            />
            <Input
              label="Email"
              value={this.state.recipientEmail}
              onChangeText={(email) => this.setState({recipientEmail: email})}
            />
            <Text>Balance: {getBalance}</Text>
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
          </Card>
          <Card style={styles.transaction}>
            <Text style={styles.action}>Recent Transactions</Text>
            <Text style={styles.link}>Show all</Text>
            <View
              style={styles.actionContainer}>
            </View>
          </Card>
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 2,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  card: {
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  actionContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    
  },
  label: {
    color: '#3366FF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  action: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  money: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 16,
    marginTop: 10,
    paddingBottom: 30,
    textAlign: 'center',
  },
  buttonItem: {
    paddingTop: 20,
    marginLeft: 20,
    marginRight: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
  },
  link: {
    textAlign: 'right',
    marginTop: 10,
  },
  transaction: {
    marginTop: 20,
    marginBottom: 20
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(PaymentScreen);
