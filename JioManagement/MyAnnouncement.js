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
import {Text, Layout, Card, Divider, Icon} from '@ui-kitten/components';
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
      announcement: null,
      requests: [],
      refreshing: false,
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
  // onRefresh = () => {
  //   this.setState({
  //     refreshing: true,
  //   });
  //   this.getAnnouncement(this.props.route.params.announcementId);
  //   this.getWalletAmount(this.props.route.params.announcementId);
  //   this.setState({
  //     refreshing: false,
  //   });
  // };

  //Retrieve Announcement details
  async getAnnouncement(announcementId) {
    try {
      const response = await axios.get(
        `${globalVariable.announcementApi}by/${announcementId}`
      );

      this.setState({
        announcement: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Retrieve requests tagged to announcement
  async getRequests(announcementId) {
    try {
      const response = await axios.get(
        `${globalVariable.requestApi}retrieve-by-announcement/${announcementId}`
      );
      const requests = response.data;
      const sortedRequests = await requests.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      this.setState({
        requests: sortedRequests,
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderItem = () => {
    return this.state.requests.slice(0, 5).map((request, index) => {
      const counter = 5;
      if (counter === index + 1) {
        return (
          <View key={request.requestId}>
            <TouchableOpacity
              style={styles.requestRow}
              //Navigate to see details of request
              // onPress={() =>
              //   this.props.navigation.navigate('RequestDetails', {
              //     requestId: request.requestId,
              //   })}
            >
              <Text style={styles.amount}>{request.title}</Text>
              <Text style={styles.requestType}>{request.amount}</Text>

              {/* <Text style={}>{request.description}</Text> */}
            </TouchableOpacity>
          </View>
        );
      }
      if (counter > index + 1) {
        return (
          <View key={request.requestId}>
            <TouchableOpacity
              style={styles.requestRow}
              // onPress={() =>
              //   this.props.navigation.navigate('TransactionDetails', {
              //     transactionId: transaction.transactionId,
              //   })}
            >
              <Text style={styles.amount}>{request.title}</Text>
              <Text style={styles.requestType}>{request.amount}</Text>
              {/* Another line for the description */}
              {/* <Text style={}>{request.description}</Text> */}
            </TouchableOpacity>
            <Divider />
          </View>
        );
      }
    });
  };

  render() {
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
              My Announcement
            </Text>
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.navigate('PaymentSettings')}>
              <Icon
                style={styles.setting}
                name="settings-outline"
                fill="#777"
              />
            </TouchableOpacity> */}
          </View>

          <ScrollView style={styles.container}>
            <Card style={styles.card}>
              <Text category="label" style={styles.label}>
                Destination
              </Text>
              <Text style={{fontWeight: 'bold'}} category="h5">
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
                {this.state.announcement.closeTime}
              </Text>

              <Text category="label" style={styles.label}>
                Start Location
              </Text>
              <Text style={styles.word}>
                {this.state.announcement.startLocation}
              </Text>
            </Card>
            <Card style={styles.request}>
              <View style={styles.requestHeader}>
                <Text style={styles.recentRequestsTitle}>
                  Requests under announcement
                </Text>
                <TouchableOpacity
                //navigate to see all the requests under the announcement in the page
                // onPress={() =>
                //   this.props.navigation.navigate('RequestsUnderAnnoucements')}
                >
                  <Text style={styles.showAllLink}>Show all</Text>
                </TouchableOpacity>
              </View>
              <View>
                {renderIf(
                  this.state.requests.length === 0,
                  <Text>No requests for this announcement</Text>
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
    marginTop: 60,
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
  quickActionContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    color: '#3366FF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recentRequestsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  money: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  subtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 16,
    marginTop: 10,
    paddingBottom: 30,
    textAlign: 'center',
  },
  buttonItem: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
  },
  showAllLink: {
    marginBottom: 10,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 16,
    flex: 1,
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
  },
  description: {
    fontSize: 14,
    color: '#888888',
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
