import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {
  StatusBar,
  Image,
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Icon,
  Select,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';
import {UserAvatar} from '../GLOBAL_VARIABLE';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {setUser} from '../redux/actions';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      refreshing: false,
      announcements: [],
      startLocationStr: 'Select a location',
      selectedIndex: new IndexPath(0),
      filterdata: ['Distance', 'Closing Time', 'Time Listed'],
      displayValue: 'Distance',
    };
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });

    this.getAnnouncements();
  };

  componentDidMount() {
    if (this.props.user.defaultAddressId !== null) {
      this.getDefaultAddress();
    }
    this.getAnnouncements();
  }

  componentDidUpdate(prevProps,prevState) {
    if (this.state.selectedIndex.row === 0 && this.state.displayValue !== prevState.displayValue) {
      //Update announcement by distance
      this.getAnnouncements()
      console.log(this.state.announcements)
    } else if (this.state.selectedIndex.row === 1 && this.state.displayValue !== prevState.displayValue) {
      //Update announcement by close time
      const response = this.state.announcements
      const sortedAnnouncements = response.sort(
        (a, b) => new Date(a.announcement.closeTime) - new Date(b.announcement.closeTime)
      );
      this.setState({
        announcements: sortedAnnouncements,
      });
      console.log(sortedAnnouncements)
    } else if (this.state.selectedIndex.row === 2 && this.state.displayValue !== prevState.displayValue) {
      // Update announcement by time listed
      const response = this.state.announcements
      const sortedAnnouncements = response.sort(
        (a, b) => new Date(a.announcement.createdAt) - new Date(b.announcement.createdAt)
      );
      this.setState({
        announcements: sortedAnnouncements,
      });
      console.log(sortedAnnouncements)
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
        globalVariable.announcementApi +
          'nearby-announcements/' +
          this.props.user.defaultAddressId
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
    this.state.announcements.map((announcementObj) => {
      let announcer = announcementObj.announcement.User;
      let announcement = announcementObj.announcement;

      //need to convert to date because its a string
      var cDate = new Date(announcement.closeTime);
      var formattedDate = this.formatDate(cDate);
      var formattedTime = this.formatTime(cDate);
      return (
        <Card
          style={styles.card}
          key={announcement.announcementId}
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

  renderOption = (title, index) => <SelectItem title={title} key={index}/>;

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
            onPress={() => this.props.navigation.replace('HealthDeclaration', {
              startJio: 'startJio'
            })}>
            <Image
              style={{
                width: 400,
                height: 120,
                alignSelf: 'center',
              }}
              source={require('../img/homeImg.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.replace('HealthDeclaration')}>
            <Image
              style={{
                width: 400,
                height: 120,
                alignSelf: 'center',
              }}
              source={require('../img/health.png')}
            />
          </TouchableOpacity>

          <Text style={styles.subheader} category="h6">
            Jios near
          </Text>
          <Card
            style={styles.locationCard}
            onPress={() =>
              this.props.navigation.navigate('Address', {
                screen: 'Home',
              })
            }>
            <Text style={{fontFamily: 'Karla-Bold'}}>
              {this.state.startLocationStr}
            </Text>
          </Card>
          <View style={styles.filterrow}>
            <Text style={styles.filterheader} category="h6">
              Filter
            </Text>
            <Icon style={styles.icon} fill="#8F9BB3" name="options-2-outline" />
            <Layout
              style={{width: 300, backgroundColor: '#F5F5F5', marginRight: 20}}
              level="1">
              <Select
                placeholder="Default"
                value={this.state.displayValue}
                selectedIndex={this.state.selectedIndex}
                onSelect={(index) => {
                  this.setState(
                    {selectedIndex: index},
                    this.setState({
                      displayValue: this.state.filterdata[index - 1],
                    })
                  );
                }}>
                {this.state.filterdata.map(this.renderOption)}
              </Select>
            </Layout>
          </View>
          {this.renderContent()}
        </ScrollView>
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
  filterrow: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 10,
  },
  filterheader: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    fontFamily: 'Karla-Bold',
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
