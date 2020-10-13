import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StatusBar,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Divider,
  List,
  ListItem,
  Button
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';

class TransactionsListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    };
  }

  componentDidMount() {
    this.getTransactions(this.state.user.userId);
  }

  //obtain the full list of transactions, credit and debit transactions
  async getTransactions(userId) {
    try {
      const response = await axios.get(
        globalVariable.transactionApi + `by/${userId}`
      );
      console.log(response);
      //set state of full list of transactions
      this.setState({
        transactions: response.data,
      });
      getCreditTransactions()
    } catch (error) {
      console.log(error);
    }
  }

  //render the list of transactions
  renderItem = ({item}) => {
    if (item.senderWalletId === this.state.user.Wallet.walletId) {
      return (
        <TouchableOpacity onPress= {() => {}}>
          <ListItem
            style={styles.listItemMinus}
            title={`- SGD ${item.amount}`}
            description={item.description}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress= {() => {}}>
          <ListItem
            style={styles.listItemPlus}
            title={`+ SGD ${item.amount}`}
            description={item.description}
          />
        </TouchableOpacity>
      )
    }
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <Text style={styles.header} category="h4">
          Transactions
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            marginBottom: 20,
            alignSelf: 'center',
          }}>
          <Button
            style={{width: 150}}
            onPress={() => this.viewAllTime()}>
            All-Time
          </Button>
          <Button
            style={{width: 150}}
            onPress={() => this.viewMonthly()}>
            Monthly
          </Button>
          </View>
          <Card style={styles.transaction}>
            <Text style={styles.action}>Recent Transactions</Text>
            <List
              Key
              style={styles.listContainer}
              data={this.state.transactions}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderItem}
            />
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
    marginTop: 20,
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
    marginBottom: 20,
    flex: 1,
  },
  listContainer: {
    maxHeight: 200,
  },
  listItemMinus: {
    paddingTop: 10,
    color: '#fff'
  },
  listItemPlus: {
    paddingTop: 10,
    color: 'green'
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(TransactionsListScreen);
