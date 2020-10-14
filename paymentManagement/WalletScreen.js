import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Divider,
  List,
  ListItem,
  Icon,
} from '@ui-kitten/components';
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
    };
  }

  componentDidMount() {
    this.getTransactions(this.state.user.userId);
    this.getWalletAmount(this.state.user.userId);
  }

  //obtain the list of transactions
  async getTransactions(userId) {
    try {
      const response = await axios.get(
        `${globalVariable.transactionApi}by/${userId}`
      );
      const transactions = response.data;
      const sortedTransactions = transactions.sort(
        (a, b) => b.createdAt - a.createdAt
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
      const response = await axios.get(
        `${globalVariable.userApi}${userId}`
      );
      this.setState({
        user: response.data,
      });
      this.props.setUser(this.state.user);
    } catch (error) {
      console.log(error);
    }
  }

  //render the list of transactions
  renderItem = ({item, index}) => {
    const counter = 5;
    if (counter === index + 1) {
      if (item.senderWalletId === this.state.user.Wallet.walletId) {
        return (
          <View>
            <ListItem
              onPress={() =>
                this.props.navigation.navigate('TransactionDetails', {
                  transactionId: item.transactionId,
                })
              }
              title={<Text style={styles.amount}>- SGD ${item.amount}</Text>}
              description={<Text style={styles.description}>{item.description}</Text>}
            />
          </View>
        );
      } else {
        return (
          <View>
            <ListItem
              onPress={() =>
                this.props.navigation.navigate('TransactionDetails', {
                  transactionId: item.transactionId,
                })
              }
              title={<Text>+ SGD ${item.amount}</Text>}
              description={<Text style={styles.description}>{item.description}</Text>}
            />
          </View>
        );
      }
    }
    if (counter > index) {
      if (item.senderWalletId === this.state.user.Wallet.walletId) {
        return (
          <View>
            <ListItem
              onPress={() =>
                this.props.navigation.navigate('TransactionDetails', {
                  transactionId: item.transactionId,
                })
              }
              title={<Text>- SGD ${item.amount}</Text>}
              description={<Text style={styles.description}>{item.description}</Text>}
            />
            <Divider />
          </View>
        );
      } else {
        return (
          <View>
            <ListItem
              onPress={() =>
                this.props.navigation.navigate('TransactionDetails', {
                  transactionId: item.transactionId,
                })
              }
              title={<Text>+ SGD ${item.amount}</Text>}
              description={<Text style={styles.description}>{item.description}</Text>}
            />
            <Divider />
          </View>
        );
      }
    }
  };

  render() {
    return (
      <Layout style={styles.layout}>
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
            <Icon style={styles.setting} name="settings-outline" fill="#777" />
          </TouchableOpacity>
        </View>
        <Card style={styles.card}>
          <Text style={styles.label}>Balance</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{marginTop: 5}}>SGD</Text>
            <Text style={styles.money}>{this.state.user.Wallet.balance}</Text>
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
              onPress={() => this.props.navigation.navigate('Withdraw')}
              style={styles.buttonItem}>
              <Image
                source={require('../img/withdraw.png')}
                style={styles.imageContainer}
              />
              <Text style={styles.subtitle}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Donate');
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
          <List        
            keyExtractor={(item) => item.transactionId}
            data={this.state.transactions}
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
    flex: 1
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
  description: {
    fontSize: 14, 
    color: '#888888'
  }
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
