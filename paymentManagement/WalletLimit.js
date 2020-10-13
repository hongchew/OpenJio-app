import React from 'react';
import {connect} from 'react-redux';
import {View, StatusBar, Alert, StyleSheet} from 'react-native';
import {Text, Layout, Button, Card} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import {ScrollView} from 'react-native-gesture-handler';
import {setUser, updateWallet} from '../redux/actions';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class WalletLimit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walletLimit: this.props.user.Wallet.walletLimit,
    };
  }

  createTwoButtonAlert = (message) =>
    Alert.alert(
      'OpenJio',
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false}
    );

  async removeWalletLimit() {
    try {
      console.log(globalVariable.walletApi + 'remove-wallet-limit');
      const response = await axios.put(
        globalVariable.walletApi + 'remove-wallet-limit',
        {
          walletId: this.props.user.Wallet.walletId,
        }
      );
      console.log(response.data);
      this.props.updateWallet(response.data);
      this.setState({
        message: 'Wallet Limit Removed.',
      });
      console.log(this.state.message);
      this.createTwoButtonAlert(this.state.message);
    } catch (error) {
      this.setState({
        message: 'Wallet Limit Removal Failed.',
      });
      console.log(error);
    }
  }

  async handleAddLimit() {
    this.props.navigation.navigate('AddWalletLimit');
  }

  async handleEditLimit() {
    this.props.navigation.navigate('EditWalletLimit');
  }

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <View style={styles.headerRow}>
          <Text style={styles.header} category="h4">
            Wallet Limit
          </Text>
        </View>
        <ScrollView style={styles.container}>
          <Card style={styles.card}>
            <Text>
              {this.props.user.Wallet.walletLimit == null
                ? 'No Wallet Limit'
                : this.props.user.Wallet.walletLimit}
            </Text>
            {/* {renderIf(
              this.state.noWalletLimit,
              <Text>No Wallet Limit</Text>,
              <Text>{this.props.user.Wallet.walletLimit}</Text>
            )} */}
          </Card>
        </ScrollView>

        <View style={styles.buttons}>
          {renderIf(
            this.props.user.Wallet.walletLimit == null,
            <Button
              size="small"
              style={styles.button}
              onPress={() => {
                this.handleAddLimit();
              }}>
              Add Wallet Limit
            </Button>
          )}
          {renderIf(
            !(this.props.user.Wallet.walletLimit == null),
            <Button
              size="small"
              style={styles.button}
              onPress={() => {
                this.handleEditLimit();
              }}>
              Edit Wallet Limit
            </Button>
          )}
          {renderIf(
            !(this.props.user.Wallet.walletLimit == null),
            <Button
              size="small"
              style={styles.button}
              onPress={() => {
                this.removeWalletLimit();
              }}>
              Remove Wallet Limit
            </Button>
          )}
        </View>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 30,
    fontFamily: 'Karla-Bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: -10,
  },
  description: {
    marginLeft: 20,
  },
  label: {
    marginTop: 10,
  },
  word: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },
  firstCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 24,
    //shadowColor doesn't work on android
    //shadowColor: 'blue',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 4,
    padding: -2,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    //marginTop: 30,
    height: 40,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
  buttons: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 200,
  },
});

const mapStateToProps = (state) => {
  //   console.log(state);
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateWallet: (wallet) => {
      dispatch(updateWallet(wallet));
    },
    setUser: (user) => {
      dispatch(setUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletLimit);
