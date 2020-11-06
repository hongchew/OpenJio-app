import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {
  View,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Text, Layout, Card, Divider, Button} from '@ui-kitten/components';
import {useIsFocused} from '@react-navigation/native';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';
import {setUser} from '../redux/actions';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

class MyAnnouncement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      announcement: {},
      requests: [],
      totalAmount: 0,
      refreshing: false,
      startLocation: '',
      acceptedRequest: false,
    };
  }

  componentDidMount() {
    // AnnouncementId will be passed from My Activities page
    const announcementId = this.props.route.params.announcementId;
    this.getAnnouncement(announcementId);
    this.getRequests(announcementId);

    // this.getWalletAmount(this.props.user.userId);
  }

  //Try if this works
  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getAnnouncement(this.props.route.params.announcementId);
    this.getRequests(this.props.route.params.announcementId);
    this.setState({
      refreshing: false,
    });
  };

  //Retrieve Announcement details
  async getAnnouncement(announcementId) {
    try {
      const response = await axios.get(
        `${globalVariable.announcementApi}by/${announcementId}`
      );
      //console.log(response.data);

      const address = await axios.get(
        `${globalVariable.addressApi}retrieve-addressId/${response.data.startLocation}`
      );

      this.setState({
        announcement: response.data,
        startLocation:
          address.data.line1 +
          ', ' +
          address.data.country +
          ' ' +
          address.data.postalCode,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Retrieve requests tagged to announcement
  async getRequests(announcementId) {
    try {
      const response = await axios.get(
        `${globalVariable.announcementApi}all-requests/${announcementId}`
      );
      const requests = response.data;
      const sortedRequests = await requests.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      this.setState({
        requests: sortedRequests,
      });

      //get the total amount from the requests that this announcement has
    } catch (error) {
      console.log(error);
    }

    const accepted = this.state.requests.filter(
      (request) =>
        request.requestStatus === 'SCHEDULED' ||
        request.requestStatus === 'DOING' ||
        request.requestStatus === 'COMPLETED' ||
        request.requestStatus === 'VERIFIED'
    );
    if (accepted.length !== 0) {
      this.setState({
        acceptRequest: true,
      });
    }
  }

  formatDate(date) {
    var formattedDate =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    return formattedDate;
  }

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

  handleEdit() {}

  handleClose() {}

  async acceptRequest(requestId) {}

  async rejectRequest(requestId) {}

  renderAmount = () => {
    const acceptedRequests = this.state.requests.filter(
      (request) =>
        request.requestStatus === 'SCHEDULED' ||
        request.requestStatus === 'DOING'
    );
    let totalAmount = 0;
    acceptedRequests.map((request) => {
      totalAmount += request.amount;
    });

    return (
      <Text style={{fontWeight: 'bold', marginTop: 5, marginBottom: 5}}>
        SGD {totalAmount.toFixed(2)}
      </Text>
    );
  };

  renderActiveButton = () => {
    //announcement is ACTIVE and has already accepted request, can only close
    if (
      this.state.announcement.announcementStatus === 'ACTIVE' &&
      this.state.acceptedRequest
    ) {
      return (
        <Button
          style={{marginLeft: 15, marginRight: 15}}
          onPress={() => {}}
          size="small">
          Close
        </Button>
      );
    } else if (this.state.announcement.announcementStatus === 'ACTIVE') {
      return (
        <View style={styles.buttons}>
          <Button
            size="small"
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate('MakeAnnouncement', {
                announcementId: this.props.route.params.announcementId,
              });
            }}>
            Edit
          </Button>
          <Button
            size="small"
            style={styles.button}
            onPress={() => {
              this.handleClose();
            }}>
            Close
          </Button>
        </View>
      );
    }
  };

  renderItem = () => {
    return this.state.requests.slice(0, 5).map((request, index) => {
      const counter = 5;
      const status = request.requestStatus;
      let displayStatus;
      if (status === 'PENDING') {
        displayStatus = 'Pending';
      } else if (status === 'SCHEDULED') {
        displayStatus = 'Scheduled';
      } else if (status === 'REJECTED') {
        displayStatus = 'Rejected';
      } else if (status === 'DOING') {
        displayStatus = 'Doing';
      } else {
        displayStatus = 'Completed';
      }

      if (counter === index + 1) {
        return (
          <View key={request.requestId} style={styles.requestRow}>
            <View style={{marginRight: 50}}>
              <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('RequestDetails', {
                  requestId: request.requestId,
                })}
              >
                <Text style={{fontWeight: 'bold'}}>{request.title}</Text>
                <Text style={{flexShrink: 1}}>{request.description}</Text>
                <Text>${request.amount}</Text>
              </TouchableOpacity>
            </View>

            {renderIf(
              status === 'PENDING',
              <View style={styles.selection}>
                <TouchableOpacity
                  // onPress={() => this.acceptRequest(request.requestId)}
                  style={styles.buttonItem}>
                  <Image
                    source={require('../img/check.png')}
                    style={styles.imageContainer}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={() => this.rejectRequest(request.requestId)}
                  style={styles.buttonItem}>
                  <Image
                    source={require('../img/cross.png')}
                    style={styles.imageContainer}
                  />
                </TouchableOpacity>
              </View>,
              <Text style={styles.status}>{displayStatus}</Text>
            )}
          </View>
        );
      }
      if (counter > index + 1) {
        return (
          <View key={request.requestId} style={styles.requestRow}>
            <View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('RequestDetails', {
                  requestId: request.requestId,
                })}
              >
                <Text style={{fontWeight: 'bold'}}>{request.title}</Text>

                <Text>{request.description}</Text>
                <Text>SGD {parseFloat(request.amount).toFixed(2)}</Text>
              </TouchableOpacity>
            </View>

            {renderIf(
              status === 'PENDING',
              <View style={styles.selection}>
                <TouchableOpacity
                  // onPress={() => this.acceptRequest(request.requestId)}
                  style={styles.buttonItem}>
                  <Image
                    source={require('../img/check.png')}
                    style={styles.imageContainer}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={() => this.rejectRequest(request.requestId)}
                  style={styles.buttonItem}>
                  <Image
                    source={require('../img/cross.png')}
                    style={styles.imageContainer}
                  />
                </TouchableOpacity>
              </View>,
              <Text style={styles.status}>{displayStatus}</Text>
            )}

            <Divider />
          </View>
        );
      }
    });
  };

  render() {
    const closeDate = new Date(this.state.announcement.closeTime);
    const formattedDate = this.formatDate(closeDate);
    const formattedTime = this.formatTime(closeDate);
    return (
      <Layout style={styles.layout}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <FocusAwareStatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor="transparent"
            translucent={true}
          />
          <View style={styles.headerRow}>
            <Text style={styles.header} category="h4">
              My Jio
            </Text>
          </View>

          <ScrollView style={styles.container}>
            <Card style={styles.card}>
              <Text category="label" style={styles.label}>
                Destination
              </Text>
              <Text style={styles.cardtitle} category="h5">
                {this.state.announcement.destination}
              </Text>

              <Text category="label" style={styles.label}>
                Description
              </Text>
              <Text style={styles.word}>
                {this.state.announcement.description}
              </Text>

              <Text category="label" style={styles.label}>
                Close Time
              </Text>

              <Text style={styles.word}>
                {this.state.announcement.closeTime
                  ? formattedDate + ', ' + formattedTime
                  : 'Loading...'}
              </Text>

              <Text category="label" style={styles.label}>
                Start Location
              </Text>
              <Text style={styles.word}>{this.state.startLocation}</Text>

              <Text category="label" style={styles.label}>
                Total Amount from Accepted Requests
              </Text>
              {this.renderAmount()}

              <Text category="label" style={styles.label}>
                Status
              </Text>

              <View>
                <Text
                  style={{color: '#3366FF', marginTop: 5, fontWeight: 'bold'}}>
                  {this.state.announcement.announcementStatus === 'ACTIVE' &&
                    'Active'}
                  {this.state.announcement.announcementStatus === 'ONGOING' &&
                    'Ongoing'}
                  {this.state.announcement.announcementStatus === 'PAST' &&
                    'Past'}
                </Text>
              </View>
            </Card>

            {this.renderActiveButton()}
            {this.state.announcement.announcementStatus === 'PAST' && (
              <Button
                style={{marginLeft: 15, marginRight: 15}}
                onPress={() => {}}
                size="small">
                Contact Support
              </Button>
            )}

            <Card style={styles.request}>
              <View style={styles.requestHeader}>
                <Text style={styles.recentRequestsTitle}>
                  Requests under Jio
                </Text>
                <TouchableOpacity
                //navigate to see all the requests under the announcement in the page
                // onPress={() =>
                //   this.props.navigation.navigate('RequestsUnderAnnoucements')}
                >
                  <Text>Show all</Text>
                </TouchableOpacity>
              </View>
              <View>
                {renderIf(
                  this.state.requests.length === 0,
                  <Text>No requests for this jio</Text>
                )}
                {this.renderItem()}
              </View>
            </Card>
          </ScrollView>
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'flex-start',
  },
  header: {
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  card: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  selection: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  label: {
    marginTop: 5,
    color: 'grey',
  },
  word: {
    marginTop: 5,
    marginBottom: 8,
    lineHeight: 22,
    justifyContent: 'center',
  },
  cardtitle: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    height: 40,
    width: '48%',
  },
  buttons: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
  },
  recentRequestsTitle: {
    fontWeight: 'bold',
    marginBottom: 14,
  },
  buttonItem: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: 30,
    height: 30,
  },
  request: {
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
  },
  setting: {
    width: 25,
    height: 25,
    marginTop: 65,
    marginRight: 20,
  },
  status: {
    marginLeft: 'auto',
    fontStyle: 'italic',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestType: {
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
  },
  requestRow: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  description: {
    fontSize: 14,
    color: '#888888',
  },
  requestTitle: {
    fontWeight: 'bold',
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAnnouncement);
