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
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {updateAddressArr} from '../redux/actions';

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

  async handleAddAddress() {
    if (
      this.state.line1 === null ||
      this.state.postalCode === null ||
      this.state.country === null ||
      this.state.description === null
    ) {
      this.setState({
        message: 'Required fields are empty. Unable to add address.',
      });
    } else {
      try {
        const response = await axios.post(globalVariable.addressApi + 'add', {
          userId: this.props.user.userId,
          address: {
            line1: this.state.line1,
            line2: this.state.line2,
            postalCode: this.state.postalCode,
            country: this.state.country,
            description: this.state.description,
          },
        });
        this.props.updateAddressArr(response.data);
        if (this.props.route.params) {
          this.props.navigation.replace('Address', {
            screen: 'Home'
          });
        } else {
          this.props.navigation.replace('Address');
        }
        
      } catch (error) {
        console.log(error);
        this.setState({
          message: 'Unable to add address.',
        });
      }
    }
  }

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
                label="Description"
                value={this.state.description}
                onChangeText={(text) => this.setState({description: text})}
              />
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
    updateAddressArr: (addresses) => {
      dispatch(updateAddressArr(addresses));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAddress);
