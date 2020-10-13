import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Divider,
  List,
  ListItem,
  Button,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';

class TransactionsListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      filter: 'all',
      allButtonStatus: 'primary',
      creditButtonStatus: 'basic',
      debitButtonStatus: 'basic',
    };
  }

  componentDidMount() {
    this.getAllTransactions(this.state.user.userId);
  }

  //obtain the full list of transactions, credit and debit transactions
  async getAllTransactions(userId) {
    try {
      const response = await axios.get(
        globalVariable.transactionApi + `by/${userId}`
      );
      console.log(response);
      //set state of full list of transactions
      this.setState({
        transactions: response.data,
      });
      console.log('getting to credit transactions');
      this.getCreditTransactions(response.data);
      this.getDebitTransactions(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async getCreditTransactions(transactions) {
    const creditTransactions = await transactions.filter(
      (transaction) =>
        transaction.recipientWalletId === this.state.user.Wallet.walletId
    );
    console.log('Credit transactions:');
    console.log(creditTransactions);
    this.setState({
      creditTransactions: creditTransactions,
    });
  }

  async getDebitTransactions(transactions) {
    const debitTransactions = await transactions.filter(
      (transaction) =>
        transaction.senderWalletId === this.state.user.Wallet.walletId
    );
    console.log('Debit transactions:');
    console.log(debitTransactions);
    this.setState({
      debitTransactions: debitTransactions,
    });
  }

  //render the list of transactions
  renderItem = ({item}) => {
    if (item.senderWalletId === this.state.user.Wallet.walletId) {
      return (
        <ListItem
          onPress={() =>
            this.props.navigation.navigate('MakePayment', {
              transactionId: item.transactionId,
            })
          }
          title={`- SGD ${item.amount}`}
          description={item.description}
        />
      );
    } else {
      return (
        <ListItem
          onPress={() =>
            this.props.navigation.navigate('MakePayment', {
              transactionId: item.transactionId,
            })
          }
          title={`+ SGD ${item.amount}`}
          description={item.description}
        />
      );
    }
  };

  viewAll = () => {
    this.setState({
      filter: 'all',
      allButtonStatus: 'primary',
      creditButtonStatus: 'basic',
      debitButtonStatus: 'basic',
    });
  };

  viewCredit = () => {
    this.setState({
      filter: 'credit',
      allButtonStatus: 'basic',
      creditButtonStatus: 'primary',
      debitButtonStatus: 'basic',
    });
  };

  viewDebit = () => {
    this.setState({
      filter: 'debit',
      allButtonStatus: 'basic',
      creditButtonStatus: 'basic',
      debitButtonStatus: 'primary',
    });
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <Text style={styles.header} category="h4">
          Transaction History
        </Text>
        <View style={styles.transactionTab}>
          <Button
            status={this.state.allButtonStatus}
            style={styles.buttonItem}
            onPress={this.viewAll}>
            All
          </Button>
          <Button
            status={this.state.creditButtonStatus}
            style={styles.buttonItem}
            onPress={this.viewCredit}>
            Incoming
          </Button>
          <Button
            status={this.state.debitButtonStatus}
            style={styles.buttonItem}
            onPress={this.viewDebit}>
            Outgoing
          </Button>
        </View>
        <Card style={styles.transactionList}>
          <Text style={styles.action}>Recent Transactions</Text>
          {renderIf(
            this.state.filter === 'all',
            <List
              data={this.state.transactions}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderItem}
            />
          )}
          {renderIf(
            this.state.filter === 'credit',
            <List
              data={this.state.creditTransactions}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderItem}
            />
          )}
          {renderIf(
            this.state.filter === 'debit',
            <List
              data={this.state.debitTransactions}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderItem}
            />
          )}
        </Card>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
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
  action: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonItem: {
    width: 110,
  },
  transactionList: {
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
  },
  transactionTab: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(TransactionsListScreen);
