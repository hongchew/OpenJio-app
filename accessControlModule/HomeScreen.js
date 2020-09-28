import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, StyleSheet} from 'react-native';
import {Text, Layout, Menu, MenuItem} from '@ui-kitten/components';
import {logout} from '../redux/actions';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
    };
    //console.log(this.props.user);
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
        <Layout style={styles.container}>
          <Text style={styles.header} category="h4">
            {this.state.user.name}'s profile
          </Text>
          <Menu style={styles.menu}>
            <MenuItem
              title={<Text style={styles.menuItem}>Personal Details</Text>}
            />
            <MenuItem
              title={<Text style={styles.menuItem}>Change Password</Text>}
            />
            <MenuItem
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
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  menu: {
    flex: 1,
    backgroundColor: 'white',
  },
  menuItem: {
    fontSize: 16,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, {logout})(HomeScreen);
