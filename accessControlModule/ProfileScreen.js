import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, ImageBackground, StyleSheet} from 'react-native';
import {Text, Layout, Menu, MenuItem, Icon, Card} from '@ui-kitten/components';
import {logout} from '../redux/actions';

const PasswordIcon = (props) => (
  <Icon {...props} name='shield-outline' width='25' height='25'/>
);

const EditIcon = (props) => (
  <Icon {...props} name='edit-2-outline' width='25' height='25'/>
);

const LogoutIcon = (props) => (
  <Icon {...props} name='log-out' width='25' height='25'/>
);

const VerifyIcon = (props) => (
  <Icon {...props} name='person-done-outline' width='25' height='25'/>
)

const AddressIcon = (props) => (
  <Icon {...props} name='map-outline' width='25' height='25'/>
)

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
    };
    //console.log(this.props);
  }

  handleLogout = () => {
    this.props.logout();
    this.setState({
      user: {},
    });
    this.props.navigation.replace('Login');
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
            Profile
          </Text>
        <Layout style={styles.container}>
          
          <Card style={styles.firstCard}>
            <Text>
              Name: {this.props.user.name} {"\n"}
              Email: {this.props.user.email}
            </Text>
          </Card>
          
            <Menu style={styles.menu}>
              <MenuItem
                accessoryLeft={EditIcon}
                title={<Text style={styles.menuItem}>Edit Profile</Text>}
                onPress={() => this.props.navigation.navigate('EditProfile')}
              />
              <MenuItem
                accessoryLeft={VerifyIcon}
                title={<Text style={styles.menuItem}>Verify Account</Text>}
                onPress={() => this.props.navigation.navigate('ChangePassword')}
              />
              <MenuItem
                accessoryLeft={PasswordIcon}
                title={<Text style={styles.menuItem}>Change Password</Text>}
                onPress={() => this.props.navigation.navigate('ChangePassword')}
              />
          
              <MenuItem
                accessoryLeft={AddressIcon}
                title={<Text style={styles.menuItem}>Address Book</Text>}
                onPress={() => this.props.navigation.navigate('Address')}
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
  firstCard: {
    marginLeft: 15, 
    marginRight: 15,
    backgroundColor:"white",
    borderRadius:15,
    elevation:24,
    //shadowColor doesn't work on android
    //shadowColor: 'blue',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10, 
  },
  card: {
    backgroundColor:"white",
    borderRadius:15,
    marginTop: 20,
    elevation:4,
    padding: -2,
    shadowColor: '#ededed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10, 
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, {logout})(ProfileScreen);
