import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {
  Text,
  Layout,
  Input,
  Button,
  List,
  ListItem,
  Divider,
} from '@ui-kitten/components';
import {connect} from 'react-redux';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {setUser} from '../redux/actions';

class UserBadges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const data = new Array(15).fill({
      title: 'Item',
      description: 'Description for Item',
    });
    const renderItem = ({item, index}) => (
      <ListItem
        title={`${item.title} ${index + 1}`}
        description={`${item.description} ${index + 1}`}
      />
    );
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <Text style={styles.header} category="h4">
          My Badges
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <Layout style={styles.container}>
              <List
                // style={styles.container}
                data={badges}
                ItemSeparatorComponent={Divider}
                renderItem={renderItem}
              />
            </Layout>
          </ScrollView>
        </TouchableWithoutFeedback>
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
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 30,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
    error: state.error,
    isLoading: state.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserBadges);
