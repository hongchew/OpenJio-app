import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Icon, Input, Text, Layout} from '@ui-kitten/components';

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        
        };
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
        <Layout style={styles.container}>
          <Text style={styles.header} category="h1">
            Home page
          </Text>
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
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 20,
    fontFamily: 'Karla-Bold',
  },
  login: {
    marginTop: 20,
  },
});

export default HomeScreen;
