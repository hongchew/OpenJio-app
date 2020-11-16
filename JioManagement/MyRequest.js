import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Divider,
  MenuItem,
  Button,
  Icon,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {UserAvatar} from '../GLOBAL_VARIABLE';
import axios from 'axios';

const ForwardIcon = (props) => <Icon {...props} name="arrow-ios-forward" />;

class MyRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      request: {},
      announcer: {},
      announcement: {},
    };
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getRequest(this.props.route.params.requestId);
    this.setState({
      refreshing: false,
    });
  };

  componentDidMount() {
    const requestId = this.props.route.params.requestId;
    this.getRequest(requestId);
  }

  checkmarkIfVerified = (user) => {
    console.log(user);
    if (user && user.isSingPassVerified) {
      return (
        <Icon
          name="checkmark-circle"
          style={{width: 17, height: 17}}
          fill="green"
        />
      );
    }
  };

  formatDate(inputDate) {
    const date = new Date(inputDate);
    var formattedDate =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    return formattedDate;
  }

  formatTime(inputDate) {
    const date = new Date(inputDate);
    //convert to 12-hour clock
    var hours = date.getHours();
    var amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var formattedTime = hours + ':' + minutes + ' ' + amOrPm;
    return formattedTime;
  }

  //obtain the full list of transactions, credit and debit transactions
  async getRequest(requestId) {
    try {
      const response = await axios.get(
        `${globalVariable.requestApi}by-requestId/${requestId}`
      );
      //   console.log(response.data);
      //set state of request
      this.setState({
        request: response.data,
      });
    } catch (error) {
      console.log(error);
    }
    // try {
    //   const response = await axios.get(
    //     `${globalVariable.userApi}/${this.state.request.userId}`
    //   );
    //   console.log(response);
    //   this.setState({
    //     requestedUser: response.data,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      const response = await axios.get(
        `${globalVariable.announcementApi}by/${this.state.request.announcementId}`
      );
      const responseUser = await axios.get(
        `${globalVariable.userApi}${response.data.userId}`
      );
      this.setState({
        announcement: response.data,
        announcer: responseUser.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderStatus() {
    let status;
    switch (this.state.request.requestStatus) {
      case 'PENDING':
        status = 'Pending';
        break;
      case 'SCHEDULED':
        status = 'Scheduled';
        break;
      case 'REJECTED':
        status = 'Rejected';
        break;
      case 'DOING':
        status = 'Doing';
        break;
      case 'COMPLETED':
        status = 'Completed';
        break;
      case 'VERIFIED':
        status = 'Verified';
        break;
    }
    return (
      <Text style={{color: '#3366FF', marginTop: 5, fontWeight: 'bold'}}>
        {status}
      </Text>
    );
  }

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
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor="transparent"
          />
          <Text style={styles.header} category="h4">
            My Request
          </Text>
          {/* Associated announcement */}
          <Card style={styles.jioCard}>
            <Text category="label" style={styles.label}>
              Jio Details
            </Text>
            <Text style={{fontWeight: 'bold', marginTop: 5}} category="h6">
              {this.state.announcement.destination}
            </Text>

            <Text style={styles.word}>
              {this.state.announcement.description}
            </Text>

            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View>
                <Text category="label" style={styles.label}>
                  Submitted by
                </Text>
                <View style={styles.userRow}>
                  <UserAvatar
                    source={this.state.announcer.avatarPath}
                    size="small"
                  />
                  <Text style={{marginLeft: 10}}>
                    {this.state.announcer.name}
                  </Text>
                  <Layout style={{paddingLeft: 3, justifyContent: 'center'}}>
                    {this.checkmarkIfVerified(this.state.announcer)}
                  </Layout>
                </View>
              </View>
            </View>
          </Card>
          <View style={styles.moreinfobox}>
            <Card style={styles.card}>
              {/* <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Requester</Text>
                <Text>{this.state.requestedUser.name}</Text>
              </View> */}
              <View style={styles.moreinfosubbox}>
                <Text category="label" style={styles.label}>
                  Request Details
                </Text>
                <Text
                  style={{fontWeight: 'bold', marginTop: 5, marginBottom: 8}}>
                  {this.state.request.title}
                </Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text category="label" style={styles.label}>
                  Description
                </Text>
                <Text style={styles.word}>
                  {this.state.request.description}
                </Text>
              </View>

              <View style={styles.moreinfosubbox}>
                <Text category="label" style={styles.label}>
                  Request Time
                </Text>
                <Text style={styles.word}>
                  {this.state.request.createdAt
                    ? this.formatDate(this.state.request.createdAt) +
                      ', ' +
                      this.formatTime(this.state.request.createdAt)
                    : 'Loading...'}
                </Text>
              </View>

              <View style={styles.moreinfosubbox}>
                <Text category="label" style={styles.label}>
                  Price
                </Text>
                <Text style={{fontWeight: 'bold', marginBottom: 8}}>
                  {this.state.request.amount
                    ? `SGD ${parseFloat(this.state.request.amount).toFixed(2)}`
                    : 'Loading...'}
                </Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text category="label" style={styles.label}>
                  Status
                </Text>
                {this.renderStatus()}
              </View>
            </Card>

            {renderIf(
              this.state.request.requestStatus === 'PENDING',
              <Button
                style={styles.button}
                onPress={() =>
                  this.props.navigation.navigate('EditRequest', {
                    request: this.state.request,
                  })
                }>
                Edit
              </Button>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginLeft: 15,
    backgroundColor: '#F5F5F5',
    fontFamily: 'Karla-Bold',
  },
  jioCard: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 15,
    elevation: 2,
  },
  card: {
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 15,
    elevation: 2,
    marginTop: 20,
    marginBottom: 20,
  },
  userRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
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
  body: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  report: {
    paddingLeft: 18,
    marginTop: 10,
    marginBottom: 30,
  },
  buttons: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    // marginTop: 20,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MyRequest);
