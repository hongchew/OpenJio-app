import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  Image,
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Text, Layout, Card} from '@ui-kitten/components';
import {UserAvatar} from '../GLOBAL_VARIABLE';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import renderIf from '../components/renderIf';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      refreshing: false,
      announcements: [],
      startLocationStr: 'Select a location',
    };
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });

    this.getAnnouncements();
  };

  componentDidMount() {
    this.getAnnouncements();
    if (this.props.user.defaultAddressId !== null) {
      this.getDefaultAddress();
    }
  }

  getDefaultAddress = () =>
    this.props.user.Addresses.map((address) => {
      let addressStr;
      if (this.props.user.defaultAddressId === address.addressId) {
        addressStr = address.country + ' ' + address.postalCode;
        this.setState({
          defaultAddress: address,
          startLocationStr: addressStr,
        });
      }
    });

  async getAnnouncements() {
    try {
      const response = await axios.get(
        globalVariable.announcementApi + 'view-all-announcements'
      );
      this.setState({
        announcements: response.data,
        refreshing: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderContent = () => {
    return renderIf(
      this.state.announcements.length === 0,
      <Text style={styles.message}>There is no announcements yet.</Text>,
      this.renderAnnouncements()
    );
  };

  formatTime(date) {
    //convert to 12-hour clock
    var hours = date.getHours();
    var amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var formattedTime = hours + ':' + minutes + ' ' + amOrPm;
    return formattedTime;
  }

  formatDate(date) {
    var formattedDate =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    return formattedDate;
  }

  renderAnnouncements = () =>
    this.state.announcements.map((announcement) => {
      let announcer = announcement.User;
      //need to convert to date because its a string
      var cDate = new Date(announcement.closeTime);
      var formattedDate = this.formatDate(cDate);
      var formattedTime = this.formatTime(cDate);

      return (
        <Card
          style={styles.card}
          onPress={() =>
            this.props.navigation.navigate('AnnouncementDetails', {
              announcementId: announcement.announcementId,
              announcementDetails: announcement,
            })
          }>
          <Text category="label" style={styles.label}>
            Destination
          </Text>
          <Text style={{fontWeight: 'bold'}} category="h6">
            {announcement.destination}
          </Text>

          <Text category="label" style={styles.label}>
            Description
          </Text>
          <Text style={styles.word}>{announcement.description}</Text>

          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View>
              <Text category="label" style={styles.label}>
                Submitted by
              </Text>
              <View style={styles.userRow}>
                <UserAvatar source={announcer.avatarPath} size="small" />
                <Text style={styles.name}>{announcer.name}</Text>
              </View>
            </View>
            <View style={{marginLeft: 40}}>
              <Text category="label" style={styles.label}>
                Close Time
              </Text>
              <Text style={styles.word}>
                {formattedDate}, {formattedTime}
              </Text>
            </View>
          </View>
        </Card>
      );
    });

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
          translucent={true}
        />
        {/* just an empty view so that when the user scroll, it doesnt overwrite with the status bar */}
        <View style={{height: 30}}></View>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <Text style={styles.header} category="h4">
            Hey, {this.state.user.name}
          </Text>
          <Text style={styles.subtitle}>
            Start a jio to help reduce foot traffic in your neighbourhood!
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.replace('HealthDeclaration')}>
            <Image
              style={{
                width: 400,
                height: 120,
                alignSelf: 'center',
              }}
              source={require('../img/homeImg.png')}
            />
          </TouchableOpacity>

          <Text style={styles.subheader} category="h6">
            Jios near
          </Text>
          <Card
            style={styles.locationCard}
            onPress={() => this.props.navigation.navigate('Address')}>
            <Text style={{fontFamily: 'Karla-Bold'}}>
              {this.state.startLocationStr}
            </Text>
          </Card>

          {this.renderContent()}
        </ScrollView>
      </Layout>
    )

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
    marginTop: 50,
    marginBottom: 10,
    marginLeft: 20,
    fontFamily: 'Karla-Bold',
  },
  subheader: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    fontFamily: 'Karla-Bold',
  },
  subtitle: {
    //marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    color: 'grey',
    flexWrap: 'wrap',
  },
  userRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginLeft: 10,
  },
  locationCard: {
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  label: {
    marginTop: 10,
    color: 'grey',
  },
  message: {
    alignSelf: 'center',
    marginTop: 10,
  },
  word: {
    marginTop: 10,
    marginBottom: 8,
    lineHeight: 22,
    justifyContent: 'center',
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(HomeScreen);
