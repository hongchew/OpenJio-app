import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {
  View,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Text, Layout, Card, Divider, Icon} from '@ui-kitten/components';
import {useIsFocused} from '@react-navigation/native';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';
import {setUser} from '../redux/actions';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

class WalletScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      renderItemCounter: 0,
      transactions: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getTransactions(this.props.user.userId);
    this.getWalletAmount(this.props.user.userId);
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getTransactions(this.props.user.userId);
    this.getWalletAmount(this.props.user.userId);
    this.setState({
      refreshing: false,
    });
  };

  //obtain the list of transactions
  async getTransactions(userId) {
    try {
      const response = await axios.get(
        `${globalVariable.transactionApi}by/${userId}`
      );
      const transactions = response.data;
      const sortedTransactions = await transactions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      this.setState({
        transactions: sortedTransactions,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //update the wallet state whenever a transaction happens
  async getWalletAmount(userId) {
    try {
      const response = await axios.get(`${globalVariable.userApi}${userId}`);
      this.setState({
        user: response.data,
      });
      this.props.setUser(this.state.user);
    } catch (error) {
      console.log(error);
    }
  }

  renderItem = () => {
    return this.state.transactions.slice(0, 5).map((transaction, index) => {
      const counter = 5;
      if (counter === index + 1) {
        if (transaction.senderWalletId === this.state.user.Wallet.walletId) {
          return (
            <View>
              <TouchableOpacity
                style={styles.transactionRow}
                onPress={() =>
                  this.props.navigation.navigate('TransactionDetails', {
                    transactionId: transaction.transactionId,
                  })
                }>
                <Text style={styles.amount}>
                  - SGD ${transaction.amount.toFixed(2)}
                </Text>
                <Text style={styles.description}>
                  {transaction.description}
                </Text>
              </TouchableOpacity>
            </View>
          );
        } else {
          return (
            <View>
              <TouchableOpacity
                style={styles.transactionRow}
                onPress={() =>
                  this.props.navigation.navigate('TransactionDetails', {
                    transactionId: transaction.transactionId,
                  })
                }>
                <Text style={styles.amount}>
                  + SGD ${transaction.amount.toFixed(2)}
                </Text>
                <Text style={styles.description}>
                  {transaction.description}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
      }
      if (counter > index + 1) {
        let transactionType;
        if (transaction.transactionType === 'TOP_UP') {
          transactionType = 'Top Up';
        } else if (transaction.transactionType === 'DONATE') {
          transactionType = 'Donate';
        } else if (transaction.transactionType === 'WITHDRAW') {
          transactionType = 'Withdraw';
        } else {
          transactionType = 'User';
        }
        if (transaction.senderWalletId === this.state.user.Wallet.walletId) {
          return (
            <View>
              <TouchableOpacity
                style={styles.transactionRow}
                onPress={() =>
                  this.props.navigation.navigate('TransactionDetails', {
                    transactionId: transaction.transactionId,
                  })
                }>
                <Text style={styles.amount}>
                  - SGD ${transaction.amount.toFixed(2)}
                </Text>
                <Text style={styles.transactionType}>{transactionType}</Text>
              </TouchableOpacity>
              <Divider />
            </View>
          );
        } else {
          return (
            <View>
              <TouchableOpacity
                style={styles.transactionRow}
                onPress={() =>
                  this.props.navigation.navigate('TransactionDetails', {
                    transactionId: transaction.transactionId,
                  })
                }>
                <Text style={styles.amount}>
                  + SGD ${transaction.amount.toFixed(2)}
                </Text>
                <Text style={styles.transactionType}>{transactionType}</Text>
              </TouchableOpacity>
              <Divider />
            </View>
          );
        }
      }
    });
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <FocusAwareStatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor="transparent"
            translucent={true}
          />
          <View style={styles.headerRow}>
            <Text style={styles.header} category="h4">
              Wallet
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('PaymentSettings')}>
              <Icon
                style={styles.setting}
                name="settings-outline"
                fill="#777"
              />
            </TouchableOpacity>
          </View>
          <Card style={styles.card}>
            <Text style={styles.label}>Balance</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginTop: 5}}>SGD</Text>
              <Text style={styles.money}>
                {this.state.user.Wallet.balance.toFixed(2)}
              </Text>
            </View>
          </Card>

          <Card>
            <Text style={styles.recentTransactionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionContainer}>
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('TopUpScreen')}
                style={styles.buttonItem}>
                <Image
                  source={require('../img/topUp.png')}
                  style={styles.imageContainer}
                />
                <Text style={styles.subtitle}>Top-Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('MakePayment')}
                style={styles.buttonItem}>
                <Image
                  source={require('../img/sendMoney.png')}
                  style={styles.imageContainer}
                />
                <Text style={styles.subtitle}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('Withdraw')}
                style={styles.buttonItem}>
                <Image
                  source={require('../img/withdraw.png')}
                  style={styles.imageContainer}
                />
                <Text style={styles.subtitle}>Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.replace('Donate');
                }}
                style={styles.buttonItem}>
                <Image
                  source={require('../img/donate.png')}
                  style={styles.imageContainer}
                />
                <Text style={styles.subtitle}>Donate</Text>
              </TouchableOpacity>
            </View>
          </Card>
          <Card style={styles.transaction}>
            <View style={styles.transactionHeader}>
              <Text style={styles.recentTransactionsTitle}>
                Recent Transactions
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('TransactionsList')
                }>
                <Text style={styles.showAllLink}>Show all</Text>
              </TouchableOpacity>
            </View>
            <View>
              {renderIf(
                this.state.transactions.length === 0,
                <Text>No transactions yet. Start paying you noob fella!</Text>
              )}
              {this.renderItem()}
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
    justifyContent: 'flex-start',
  },
  header: {
    marginTop: 60,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  card: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  quickActionContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    color: '#3366FF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recentTransactionsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  money: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  subtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 16,
    marginTop: 10,
    paddingBottom: 30,
    textAlign: 'center',
  },
  buttonItem: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
  },
  showAllLink: {
    marginBottom: 10,
  },
  transaction: {
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
  },
  setting: {
    width: 25,
    height: 25,
    marginTop: 65,
    marginRight: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 16,
  },
  transactionType: {
    fontSize: 16,
    textAlign: 'right',
  },
  transactionRow: {
    marginTop: 10,
    marginBottom: 10,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen);
