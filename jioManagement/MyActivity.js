import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {
  StatusBar,
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Text, Button, Layout, Card} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

//to make sure the status bar change to certain colour only on this page
function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

class MyActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      filter: 'announcement',
      announcementBtnStatus: 'primary',
      requestBtnStatus: 'basic',
      announcements: [],
      requests: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getAnnouncements(this.props.user.userId);
    this.getRequests(this.props.user.userId);
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    console.log('refreshing');
    this.getAnnouncements(this.props.user.userId);
    this.getRequests(this.props.user.userId);
    this.setState({
      refreshing: false,
    });
  };

  async getAnnouncements(userId) {
    try {
      const response = await axios.get(
        `${globalVariable.announcementApi}all-announcements/${userId}`
      );
      const announcements = response.data;
      const activeAnnouncements = await announcements.filter(
        (announcement) => announcement.announcementStatus !== 'PAST'
      );
      this.setState({
        announcements: activeAnnouncements,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getRequests(userId) {
    try {
      const response = await axios.get(
        `${globalVariable.requestApi}ongoing/${userId}`
      );
      const requests = response.data;
      this.setState({
        requests: requests,
      });
    } catch (error) {
      console.log(error);
    }
  }

  viewAnnouncements = () => {
    this.setState({
      filter: 'announcement',
      announcementBtnStatus: 'primary',
      requestBtnStatus: 'basic',
    });
  };

  viewRequests = () => {
    this.setState({
      filter: 'request',
      announcementBtnStatus: 'basic',
      requestBtnStatus: 'primary',
    });
  };

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

  renderAnnouncements = () => {
    if (this.state.announcements.length === 0) {
      return (
        <Text style={styles.message}>There are no announcements made.</Text>
      );
    } else {
      return this.state.announcements.map((announcement) => {
        //need to convert to date because its a string
        const closeDate = new Date(announcement.closeTime);
        const formattedDate = this.formatDate(closeDate);
        const formattedTime = this.formatTime(closeDate);
        return (
          <Card
            style={styles.cardlisting}
            key={announcement.announcementId}
            onPress={() =>
              this.props.navigation.navigate('MyActivity', {
                announcement: announcement,
              })
            }>
            <Text category="label" style={styles.cardlabel}>
              Destination
            </Text>
            <Text style={styles.cardtitle} category="h6">
              {announcement.destination}
            </Text>

            <Text category="label" style={styles.cardlabel}>
              Description
            </Text>
            <Text style={styles.cardword}>{announcement.description}</Text>

            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View>
                <Text category="label" style={styles.cardlabel}>
                  Status
                </Text>
                {renderIf(
                  announcement.announcementStatus === 'ACTIVE',
                  <View style={styles.status}>
                    <Text style={{color: 'white'}}>Active</Text>
                  </View>
                )}
                {renderIf(
                  announcement.announcementStatus === 'ONGOING',
                  <View style={styles.status}>
                    <Text style={{color: 'white'}}>Ongoing</Text>
                  </View>
                )}
              </View>
              <View style={{marginLeft: 40}}>
                <Text category="label" style={styles.cardlabel}>
                  Close Time
                </Text>
                <Text style={styles.cardword}>
                  {formattedDate}, {formattedTime}
                </Text>
              </View>
            </View>
          </Card>
        );
      });
    }
  };

  renderRequests = () => {
    if (this.state.requests.length === 0) {
      return <Text style={styles.message}>There are no requests made.</Text>;
    } else {
      return this.state.requests.map((request) => {
        return (
          <Card
            style={styles.cardlisting}
            key={request.requestId}
            onPress={() =>
              this.props.navigation.navigate('MyActivity', {
                request: request,
              })
            }>
            <Text category="label" style={styles.cardlabel}>
              Title
            </Text>
            <Text style={styles.cardtitle} category="h6">
              {request.title}
            </Text>
            <Text category="label" style={styles.cardlabel}>
              Description
            </Text>
            <Text style={styles.cardword}>{request.description}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View>
                <Text category="label" style={styles.cardlabel}>
                  Status
                </Text>
                {renderIf(
                  request.requestStatus === 'PENDING',
                  <View style={styles.status}>
                    <Text style={{color: 'white'}}>Pending</Text>
                  </View>
                )}
                {renderIf(
                  request.requestStatus === 'SCHEDULED',
                  <View style={styles.status}>
                    <Text style={{color: 'white'}}>Accepted</Text>
                  </View>
                )}
                {renderIf(
                  request.requestStatus === 'DOING',
                  <View style={styles.status}>
                    <Text style={{color: 'white'}}>Executing</Text>
                  </View>
                )}
                {renderIf(
                  request.requestStatus === 'COMPLETED',
                  <View style={styles.status}>
                    <Text style={{color: 'white'}}>Done</Text>
                  </View>
                )}
              </View>
              <View style={{marginLeft: 40}}>
                <Text category="label" style={styles.cardlabel}>
                  Amount
                </Text>
                <Text style={styles.amount}>
                  ${parseFloat(request.amount).toFixed(2)}
                </Text>
              </View>
            </View>
          </Card>
        );
      });
    }
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="white"
        />
        <View style={styles.headerRow}>
          <Text style={styles.header} category="h4">
            My Activity
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={styles.history} status="basic">
              History
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            marginBottom: 20,
            alignSelf: 'center',
          }}>
          <Button
            status={this.state.announcementBtnStatus}
            style={{width: 150}}
            onPress={this.viewAnnouncements}>
            Jios
          </Button>
          <Button
            status={this.state.requestBtnStatus}
            style={{width: 150}}
            onPress={this.viewRequests}>
            Requests
          </Button>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <View>
            {renderIf(
              this.state.filter === 'announcement',
              this.renderAnnouncements()
            )}
            {renderIf(
              this.state.filter === 'request', 
              this.renderRequests()
            )}
          </View>
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
  header: {
    marginTop: 60,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  history: {
    marginRight: 15,
    fontSize: 16,
    marginTop: 65,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
  },
  cardlabel: {
    marginTop: 5,
    marginBottom: 5,
    color: 'grey',
  },
  cardtitle: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  cardlisting: {
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
  cardword: {
    marginTop: 5,
    marginBottom: 5,
    lineHeight: 22,
    justifyContent: 'center',
  },
  status: {
    backgroundColor: '#3366FF',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 3,
    marginBottom: 5,
    marginLeft: -10,
  },
  amount: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    lineHeight: 22,
    justifyContent: 'center',
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MyActivity);
