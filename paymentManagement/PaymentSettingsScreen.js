import React from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import {Text, Layout, Menu, MenuItem, Icon, Card} from '@ui-kitten/components';

class PaymentSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    };
  }

  //to render wallet limit icon
  walletLimitIcon = (props) => (
    <Icon {...props}
        name="minus-circle-outline"
        width= "25" 
        height= "25"
      />
  )

  //to render paypal icon
  paypalIcon = (props) => (
    <Icon {...props}
        name="credit-card-outline"
        width= "25" 
        height= "25"
      />
  )

  //to render recurrent top up icon
  recurrentTopUpIcon = (props) => (
    <Icon {...props}
        name="clock-outline"
        width= "25" 
        height= "25"
      />
  )

  render() {
    return (
      <Layout style={styles.layout}>
        <Text style={styles.header} category="h4">
          Payment Settings
        </Text>
        <Layout style={styles.container}>
          <Card style={styles.card}>
            <Text style={styles.label}>Balance</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginTop: 5}}>SGD</Text>
              <Text style={styles.money}>{this.state.user.Wallet.balance}</Text>
            </View>
          </Card>

          <Menu style={styles.menu}>
            <MenuItem
              accessoryLeft={this.walletLimitIcon}
              title={<Text style={styles.menuItem}>Wallet Limit</Text>}
              onPress={() => this.props.navigation.navigate('WalletLimit')}
            />
            <MenuItem
              accessoryLeft={this.paypalIcon}
              title={<Text style={styles.menuItem}>PayPal Account Set Up</Text>}
              onPress={() => this.props.navigation.navigate('Wallet')}
            />
            <MenuItem
              accessoryLeft={this.recurrentTopUpIcon}
              title={<Text style={styles.menuItem}>Recurrent Top Up</Text>}
              onPress={() => this.props.navigation.navigate('Wallet')}
            />
          </Menu>
        </Layout>
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
    marginLeft: 5,
    marginRight: 5,
  },
  header: {
    marginBottom: 20,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  menu: {
    flex: 1,
    marginTop: 25,
    backgroundColor: 'white',
  },
  menuItem: {
    fontSize: 16,
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
  },
  label: {
    color: '#3366FF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  money: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(PaymentSettingsScreen);
