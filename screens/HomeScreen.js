import React from 'react';
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
      secureTextEntry: true,
    };
  }

  toggleSecureEntry = () => {
    if (this.state.secureTextEntry) {
      this.setState({
        secureTextEntry: false,
      });
    } else {
      this.setState({
        secureTextEntry: true,
      });
    }
  };

  renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={this.toggleSecureEntry}>
      <Icon name={this.state.secureTextEntry ? 'eye-off' : 'eye'} {...props} />
    </TouchableWithoutFeedback>
  );

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Text style={styles.header} category="h1">
              OpenJio
            </Text>
            <Input label="Email" />
            <Input
              label="Password"
              accessoryRight={this.renderIcon}
              secureTextEntry={this.state.secureTextEntry}
            />
            <Button style={styles.login}>LOGIN</Button>
            <Button style={styles.login} status="warning">
              SIGN UP
            </Button>
          </Layout>
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
