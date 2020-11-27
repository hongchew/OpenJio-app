import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {View, StyleSheet, StatusBar, ScrollView} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Divider,
  MenuItem,
  Icon,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';

const ForwardIcon = (props) => <Icon {...props} name="arrow-ios-forward" />;

class TransactionDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      transaction: {
        senderWalletId: '',
        recipientWalletId: '',
      },
    };
  }

  componentDidMount() {
    const transactionId = this.props.route.params.transactionId;
    this.getTransaction(transactionId);
  }

  //obtain the full list of transactions, credit and debit transactions
  async getTransaction(transactionId) {
    try {
      const response = await axios.get(
        `${globalVariable.transactionApi}${transactionId}`
      );
      console.log(response.data);
      //set state of full list of transactions
      this.setState({
        transaction: response.data,
      });
    } catch (error) {
      console.log(error);
    }
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
          Transaction Details
        </Text>
        <View style={styles.moreinfobox}>
          <Card style={styles.card}>
            <Text style={styles.amountlabel}>Amount</Text>
            <View style={{flexDirection: 'row'}}>
              {renderIf(
                this.state.user.Wallet.walletId ===
                  this.state.transaction.senderWalletId,
                <Text style={{marginTop: 5}}>- SGD</Text>
              )}
              {renderIf(
                this.state.user.Wallet.walletId ===
                  this.state.transaction.recipientWalletId,
                <Text style={{marginTop: 5}}>+ SGD</Text>
              )}
              <Text style={styles.money}>
                {this.state.transaction.amount
                  ? parseFloat(this.state.transaction.amount).toFixed(2)
                  : 'Loading...'}
              </Text>
              {renderIf(
                this.state.transaction.transactionType === 'USER',
                <View style={styles.UserTransactionType}>
                  <Text style={{color: 'white'}}>User</Text>
                </View>
              )}
              {renderIf(
                this.state.transaction.transactionType === 'TOP_UP',
                <View style={styles.TopUpTransactionType}>
                  <Text style={{color: 'white'}}>Top Up</Text>
                </View>
              )}
              {renderIf(
                this.state.transaction.transactionType === 'WITHDRAW',
                <View style={styles.WithdrawTransactionType}>
                  <Text style={{color: 'white'}}>Withdraw</Text>
                </View>
              )}
              {renderIf(
                this.state.transaction.transactionType === 'DONATE',
                <View style={styles.DonateTransactionType}>
                  <Text style={{color: 'white'}}>Donate</Text>
                </View>
              )}
            </View>
          </Card>
          <Card style={styles.body}>
            <ScrollView>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Transaction ID</Text>
                <Text>{this.state.transaction.transactionId}</Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Date and Time</Text>
                <Text>
                  {new Date(this.state.transaction.createdAt).toString()}
                </Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Details</Text>
                <Text>
                  {this.state.transaction.transactionType === 'USER' &&
                    `Sender: ${this.state.transaction.senderDetails.name} (${this.state.transaction.senderDetails.email})\nRecipient: ${this.state.transaction.recipientDetails.name} (${this.state.transaction.recipientDetails.email})`}
                  {this.state.transaction.transactionType !== 'USER' &&
                    this.state.transaction.description}
                </Text>
              </View>
              {renderIf(
                this.state.transaction.transactionType === 'USER',
                <View style={styles.moreinfosubbox}>
                  <Text style={styles.moreinfotext}>Message (optional)</Text>
                  <Text>{this.state.transaction.description}</Text>
                </View>
              )}
            </ScrollView>
          </Card>
          <MenuItem
            style={styles.report}
            title="Report an issue"
            accessoryRight={ForwardIcon}
            onPress={() =>
              this.props.navigation.replace('Tabs', {screen: 'Wallet'})
            }
          />
        </View>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  header: {
    paddingLeft: 15,
    backgroundColor: '#F5F5F5',
    fontFamily: 'Karla-Bold',
  },
  card: {
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 15,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  transactionList: {
    marginBottom: 30,
    flex: 1,
  },
  transactionTab: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  amount: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#888888',
  },
  money: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  amountlabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  UserTransactionType: {
    backgroundColor: '#3366FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
  },
  TopUpTransactionType: {
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
  },
  WithdrawTransactionType: {
    backgroundColor: '#58d68d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
  },
  DonateTransactionType: {
    backgroundColor: '#FF8A80',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
  },
  moreinfobox: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  moreinfosubbox: {
    marginBottom: 20,
  },
  moreinfotext: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  body: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  report: {
    paddingLeft: 18,
    marginTop: 10,
    marginBottom: 30,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(TransactionDetailsScreen);
