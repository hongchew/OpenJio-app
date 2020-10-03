import React from 'react';
import {connect} from 'react-redux';
import {View, StatusBar, StyleSheet} from 'react-native';
import {Text, Layout, Button, Card} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import {ScrollView} from 'react-native-gesture-handler';
import {updateAddressArr, setUser} from '../redux/actions';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class AddressScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async handleSetDefault(addressId) {
    try {
      const response = await axios.put(
        globalVariable.userApi + 'update-user-details',
        {
          userId: this.props.user.userId,
          defaultAddressId: addressId,
        }
      );
      this.props.setUser(response.data);
    } catch (error) {
      console.log(error);
      this.setState({
        message: 'Unable to set default address.',
      });
    }
  }

  async handleDelete(addressId) {
    //check whether if this address is the default one
    //then i will have to set user's defaultAddressId to null before i delete
    if (this.props.user.defaultAddressId == addressId) {
      this.handleSetDefault(null);
    }

    try {
      const response = await axios.delete(
        globalVariable.addressApi + addressId
      );
      console.log(response.data);
      this.props.updateAddressArr(response.data);
    } catch (error) {
      console.log(error);
      this.setState({
        message: 'Unable to delete address.',
      });
    }
  }

  RenderAddress = () =>
    this.props.user.Addresses.map((address) => {
      let DefaultButton;
      if (this.props.user.defaultAddressId == address.addressId) {
        DefaultButton = (
          <Button style={styles.footerControl} size="small" disabled={true}>
            DEFAULT ADDRESS
          </Button>
        );
      } else {
        DefaultButton = (
          <Button
            style={styles.footerControl}
            size="small"
            onPress={() => this.handleSetDefault(address.addressId)}>
            SET DEFAULT
          </Button>
        );
      }
      const Footer = (props) => (
        <View {...props} style={[props.style, styles.footerContainer]}>
          <Button
            style={styles.footerControl}
            size="small"
            status="basic"
            onPress={() => this.handleDelete(address.addressId)}>
            DELETE
          </Button>
          {DefaultButton}
        </View>
      );

      return (
        <Card key={address.addressId} style={styles.card} footer={Footer}>
          <Text category="label" style={styles.label}>
            DESCRIPTION
          </Text>

          <Text style={{fontWeight: 'bold', marginBottom: 10}} category="h6">
            {address.description}
          </Text>
          <Text category="label" style={styles.label}>
            LINE 1
          </Text>
          {renderIf(
            address.line1 != null,
            <Text style={styles.word}>{address.line1}</Text>,
            <Text category="s2">-</Text>
          )}
          <Text category="label" style={styles.label}>
            LINE 2
          </Text>
          {renderIf(
            address.line2 != null,
            <Text style={styles.word}>{address.line2}</Text>,
            <Text category="s2">-</Text>
          )}
          <Text category="label" style={styles.label}>
            POSTAL CODE
          </Text>
          {renderIf(
            address.postalCode != null,
            <Text style={styles.word}>{address.postalCode}</Text>,
            <Text category="s2">-</Text>
          )}
          <Text category="label" style={styles.label}>
            COUNTRY
          </Text>
          {renderIf(
            address.country != null,
            <Text style={styles.word}>{address.country}</Text>,
            <Text category="s2">-</Text>
          )}
        </Card>
      );
    });

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
            Address Book
          </Text>
          {renderIf(
            this.props.user && this.props.user.Addresses.length < 3,
            <Button
              size="small"
              style={styles.button}
              onPress={() => this.props.navigation.navigate('AddAddress')}>
              ADD ADDRESS
            </Button>,
            <Button
              size="small"
              style={styles.button}
              onPress={() => this.props.navigation.navigate('AddAddress')}
              disabled={true}>
              ADD ADDRESS
            </Button>
          )}
        </View>
        <ScrollView style={styles.container}>
          {renderIf(
            this.state.message,
            <Text styles={styles.description} status="danger">
              {this.state.message}
            </Text>
          )}

          {renderIf(
            this.props.user && this.props.user.Addresses.length == 0,
            <Card style={styles.card}>
              <Text>No addresses yet</Text>
            </Card>,
            this.RenderAddress()
          )}
        </ScrollView>
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
});

const mapStateToProps = (state) => {
  //console.log(state);
  return {
    user: {
      ...state.user,
      Addresses: state.user.Addresses,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAddressArr: (addresses) => {
      dispatch(updateAddressArr(addresses));
    },
    setUser: (user) => {
      dispatch(setUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressScreen);
