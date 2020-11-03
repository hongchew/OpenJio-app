import React from 'react';
import {connect} from 'react-redux';
import {View, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {Text, Layout, Button, Card} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import {setUser} from '../redux/actions';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class StartLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      destination: this.props.route.params.destination,
      description: this.props.route.params.description,
      closeTime: JSON.parse(this.props.route.params.closeTime),
      startLocationId: this.props.user.defaultAddressId,
      message: '',
    };
  }

  async handleMakeAnnouncement() {
    if (!this.state.startLocationId) {
      this.setState({
        message: 'No address selected.',
      });
    } else {
      try {
        const response = await axios.post(
          globalVariable.announcementApi + 'create-announcement',
          {
            userId: this.props.user.userId,
            addressId: this.state.startLocationId,
            description: this.state.description,
            closeTime: this.state.closeTime,
            destination: this.state.destination,
          }
        );
        this.props.navigation.replace('Tabs', {screen: 'Home'});
      } catch (error) {
        console.log(error);
        this.setState({
          message: 'Unable to make a announcement.',
        });
      }
    }
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
      this.props.navigation.replace('Tabs', {screen: 'Home'})
    } catch (error) {
      console.log(error);
      this.setState({
        message: 'Unable to set default address.',
      });
    }
  }

  handleOnPressLocation = (addressId) => {
    //if its coming from healthdeclaration/make request pages
    if (this.props.route.params.closeTime) {
      this.setState({startLocationId: address.addressId})
    } else {  //coming from home page
      this.handleSetDefault(addressId);
    }
  }

  RenderAddress = () =>
    this.props.user.Addresses.map((address) => {
      return (
        <Card
          key={address.addressId}
          style={[
            styles.card,
            address.addressId === this.state.startLocationId
              ? {backgroundColor: '#ebebeb'}
              : '',
          ]}
          onPress={() => this.handleOnPressLocation(address.addressId)}>
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
            Start Location
          </Text>
        </View>
        <ScrollView style={styles.container}>
          {renderIf(
            this.props.user && this.props.user.Addresses.length == 0,
            <Card style={styles.card}>
              <Text>No addresses yet</Text>
            </Card>,
            this.RenderAddress()
          )}
          {/* check for announcement closing time */}
          {this.props.route.params.closeTime && (
            <Button
              style={styles.button}
              onPress={() => this.handleMakeAnnouncement()}>
              Next
            </Button>
          )}
          <Text style={styles.description} status="danger">
            {this.state.message}
          </Text>
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
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  label: {
    marginTop: 10,
  },
  word: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
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
    marginTop: 30,
    height: 40,
    marginLeft: 20,
    marginRight: 20,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartLocation);
