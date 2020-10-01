import React from 'react';
import {connect} from 'react-redux';
import {View, StatusBar, ImageBackground, StyleSheet} from 'react-native';
import {Text, Layout, Button, Icon, Card} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import {ScrollView} from 'react-native-gesture-handler';
import {deleteAddress} from '../redux/actions';
import {editProfile} from '../redux/actions';

class AddressScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      addresses: this.props.user.Addresses,
    };
    console.log(this.props);
  }

  handleDelete = (addressId) => {
    this.props.deleteAddress(addressId);
  };

  handleSetDefault = (addressId) => {
    const user = {
      userId: this.props.user.userId,
      defaultAddressId: addressId,
    };
    console.log(user);
    this.props.editProfile(user);
  };

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
            LINE 1
          </Text>
          {renderIf(
            address.line1 != null,
            <Text style={styles.word}>
              {address.line1}
              {'\n'}
            </Text>,
            <Text category="s2">-</Text>
          )}
          <Text category="label" style={styles.label}>
            LINE 2
          </Text>
          {renderIf(
            address.line2 != null,
            <Text style={styles.word}>
              {address.line2}
              {'\n'}
            </Text>,
            <Text category="s2">-</Text>
          )}
          <Text category="label" style={styles.label}>
            POSTAL CODE
          </Text>
          {renderIf(
            address.postalCode != null,
            <Text style={styles.word}>
              {address.postalCode}
              {'\n'}
            </Text>,
            <Text category="s2">-</Text>
          )}
          <Text category="label" style={styles.label}>
            COUNTRY
          </Text>
          {renderIf(
            address.country != null,
            <Text style={styles.word}>
              {address.country}
              {'\n'}
            </Text>,
            <Text category="s2">-</Text>
          )}
          <Text category="label" style={styles.label}>
            DESCRIPTION
          </Text>
          {renderIf(
            address.description != null,
            <Text style={styles.word}>
              {address.description}
              {'\n'}
            </Text>,
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
            this.state.addresses.length < 3,
            <Button
              size="small"
              style={styles.button}
              onPress={() => this.props.navigation.navigate('AddAddress')}>
              ADD ADDRESS
            </Button>
          )}
        </View>
        <ScrollView style={styles.container}>
          {/* <Text style={styles.description}>Maximum of 3 addresses</Text> */}
          {renderIf(
            this.state.addresses.length == 0,
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
    //marginTop: 30,
    marginBottom: 30,
    //marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  headerRow: {
    flexDirection: 'row',
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

// function mapStateToProps(state) {
//   return {
//     user: state.user,
//   };
// }

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
    deleteAddress: (addressId) => {
      dispatch(deleteAddress(addressId));
    },
    editProfile: (user) => {
      dispatch(editProfile(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressScreen);
