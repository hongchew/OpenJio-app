import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Text, Layout, Input, Button} from '@ui-kitten/components';
import {connect} from 'react-redux';
import loginStyle from '../styles/loginStyle';
import {addAddress} from '../redux/actions';

class AddAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
      userId: this.props.user.userId,
      line1: null,
      line2: null,
      postalCode: null,
      country: null,
      description: null,
      message: '',
      isUpdated: this.props.isUpdated,
    };
  }

  handleAddAddress = () => {
    if (
      this.state.line1 == '' ||
      this.state.country == '' ||
      this.state.postalCode == ''
    ) {
      this.setState({
        isUpdated: false,
        message: 'Line 1, country and postal code fields cannot be empty.',
      });
    } else {
      const address = {
        line1: this.state.line1,
        line2: this.state.line2,
        postalCode: this.state.postalCode,
        country: this.state.country,
        description: this.state.description,
      };
      this.props.addAddress(this.state.userId, address);

      setTimeout(() => {
        if (this.props.isUpdated) {
          this.props.navigation.replace('Address');
        } else {
          this.setState({
            message: 'Unable to update profile.',
          });
        }
      }, 800);
    }
  };

  render() {
    let responseMessage;
    if (this.state.isUpdated) {
      responseMessage = (
        <Text style={loginStyle.message} status="success">
          {this.state.message}
        </Text>
      );
    } else {
      responseMessage = (
        <Text style={loginStyle.message} status="danger">
          {this.state.message}
        </Text>
      );
    }

    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <Text style={styles.header} category="h4">
          Add Address
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <Layout style={styles.container}>
              <Input
                label="Line 1"
                value={this.state.line1}
                onChangeText={(text) => this.setState({line1: text})}
              />
              <Input
                label="Line 2 (Optional)"
                value={this.state.line2}
                onChangeText={(text) => this.setState({line2: text})}
              />
              <Input
                label="Postal Code"
                value={this.state.postalCode}
                onChangeText={(text) => this.setState({postalCode: text})}
              />
              <Input
                label="Country"
                value={this.state.country}
                onChangeText={(text) => this.setState({country: text})}
              />
              <Input
                label="Description (Optional)"
                value={this.state.description}
                onChangeText={(text) => this.setState({description: text})}
              />

              <Button
                style={styles.button}
                onPress={() => this.handleAddAddress()}>
                ADD ADDRESS
              </Button>
              {responseMessage}
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
  //console.log(state);
  return {
    user: {
      ...state.user,
      Addresses: state.user.Addresses,
    },
    isUpdated: state.isUpdated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAddress: (userId, address) => {
      dispatch(addAddress(userId, address));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAddress);
