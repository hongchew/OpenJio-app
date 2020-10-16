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
      const transactions = response.data
      const sortedTransactions = await transactions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      this.setState({
        transactions: sortedTransactions,
      });
      this.getCreditTransactions(sortedTransactions);
      this.getDebitTransactions(sortedTransactions);
    } catch (error) {
      console.log(error);
    }
  }

  async getCreditTransactions(transactions) {
    const creditTransactions = await transactions.filter(
      (transaction) =>
        transaction.recipientWalletId === this.state.user.Wallet.walletId
    );
    this.setState({
      creditTransactions: creditTransactions,
    });
  }

  async getDebitTransactions(transactions) {
    const debitTransactions = await transactions.filter(
      (transaction) =>
        transaction.senderWalletId === this.state.user.Wallet.walletId
    );
    this.setState({
      debitTransactions: debitTransactions,
    });
  }

  //render the list of transactions
  renderItem = ({item}) => {
    if (item.senderWalletId === this.state.user.Wallet.walletId) {
      return (
        <ListItem
          style={styles.listItem}
          onPress={() =>
            this.props.navigation.navigate('TransactionDetails', {
              transactionId: item.transactionId,
            })
          }
          title={<Text style={styles.amount}>- SGD ${item.amount.toFixed(2)}</Text>}
          description={<Text style={styles.description}>{item.description}</Text>}
        />
      );
    } else {
      return (
        <ListItem
          style={styles.listItem}
          onPress={() =>
            this.props.navigation.navigate('TransactionDetails', {
              transactionId: item.transactionId,
            })
          }
          title={<Text style={styles.amount}>+ SGD ${item.amount.toFixed(2)}</Text>}
          description={
            <Text style={styles.description}>{item.description}</Text>
          }
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
        <Text style={styles.action}>Recent Transactions</Text>
        <View style={styles.transactionList}>
          {renderIf(
            this.state.filter === 'all',
            <List
              style={styles.listContainer}
              data={this.state.transactions}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderItem}
            />
          )}
          {renderIf(
            this.state.filter === 'credit',
            <List
              style={styles.listContainer}
              data={this.state.creditTransactions}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderItem}
            />
          )}
          {renderIf(
            this.state.filter === 'debit',
            <List
              style={styles.listContainer}
              data={this.state.debitTransactions}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderItem}
            />
          )}
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
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  action: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
  },
  buttonItem: {
    width: 110,
  },
  transactionList: {
    marginBottom: 30,
    flex: 1
  },
  transactionTab: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#888888',
  },
  listItem: {
    marginLeft: 10,
    marginRight: 10
  },
  listContainer: {
    backgroundColor: 'white',
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(TransactionsListScreen);
