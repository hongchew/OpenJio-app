import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, View, StyleSheet} from 'react-native';
import {Text, Layout, Menu, MenuItem, Icon, Card} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';

const PasswordIcon = (props) => (
  <Icon {...props} name="shield-outline" width="25" height="25" />
);

const EditIcon = (props) => (
  <Icon {...props} name="edit-2-outline" width="25" height="25" />
);

const LogoutIcon = (props) => (
  <Icon {...props} name="log-out" width="25" height="25" />
);

const VerifyIcon = (props) => (
  <Icon {...props} name="person-done-outline" width="25" height="25" />
);

const AddressIcon = (props) => (
  <Icon {...props} name="map-outline" width="25" height="25" />
);

const BadgeIcon = (props) => (
  <Icon {...props} name="award-outline" width="25" height="25" />
);

class PaymentSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    };
  }

  displayEmailIcon = () => {
    return (
      <Icon
        name="email-outline"
        style={{width: 17, height: 17, marginBottom: -4, marginRight: 8}}
        fill="grey"
      />
    );
  };

  displayPhoneIcon = () => {
    return (
      <Icon
        name="phone-outline"
        style={{width: 17, height: 17, marginBottom: -4, marginRight: 8}}
        fill="grey"
      />
    );
  };

  checkmarkIfVerified = (user) => {
    if (user && user.isSingPassVerified) {
      return (
        <Icon
          name="checkmark-circle"
          style={{width: 17, height: 17}}
          fill="green"
        />
      );
    }
  };

  verifyAccountButton = (user) => {
    if (user && !user.isSingPassVerified) {
      return (
        <MenuItem
          accessoryLeft={VerifyIcon}
          title={<Text style={styles.menuItem}>Verify Account</Text>}
          onPress={() => this.props.navigation.navigate('VerifyAccount')}
        />
      );
    }
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
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
            <Icon name="email-outline" width="10" height="10" color="black" />
            <MenuItem
              accessoryLeft={EditIcon}
              title={<Text style={styles.menuItem}>Edit Profile</Text>}
              onPress={() => this.props.navigation.navigate('EditProfile')}
            />
            {this.verifyAccountButton(this.props.user)}
            <MenuItem
              accessoryLeft={PasswordIcon}
              title={<Text style={styles.menuItem}>Change Password</Text>}
              onPress={() =>
                this.props.navigation.navigate('ChangePassword', {
                  fromLogin: false,
                })
              }
            />
            <MenuItem
              accessoryLeft={AddressIcon}
              title={<Text style={styles.menuItem}>Address Book</Text>}
              onPress={() => this.props.navigation.navigate('Address')}
            />
            <MenuItem
              accessoryLeft={BadgeIcon}
              title={<Text style={styles.menuItem}>Badges</Text>}
              onPress={() => this.props.navigation.navigate('UserBadges')}
            />
            <MenuItem
              accessoryLeft={LogoutIcon}
              title={<Text style={styles.menuItem}>Logout</Text>}
              onPress={this.handleLogout}
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
    marginTop: 60,
    marginBottom: 30,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  label: {
    color: '#3366FF',
    fontWeight: 'bold',
    marginBottom: 5,
  },

});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(PaymentSettingsScreen);
