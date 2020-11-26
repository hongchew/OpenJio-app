import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Layout,
  Card,
  MenuItem,
  Button,
  Icon,
  Modal,
  ListItem,
  Divider,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {UserAvatar} from '../GLOBAL_VARIABLE';
import axios from 'axios';


class MyRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      request: {},
      announcer: {},
      announcement: {},
      complaint: [],
      pendingComplaints: '',
      modalVisible: false,
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

  async getRequest(requestId) {
    try {
      const response = await axios.get(
        `${globalVariable.requestApi}by-requestId/${requestId}`
      );
      const complaint = await axios.get(
        `${globalVariable.complaintApi}all-complaints/${requestId}`
      );
      const pendingComplaints = complaint.data.filter(
        (complaint) => complaint.complaintStatus === 'PENDING'
      ).length;

      //set state of request and complaint
      this.setState({
        request: response.data,
        complaint: complaint.data,
        pendingComplaints: pendingComplaints,
      });
    } catch (error) {
      console.log(error);
    }

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


  renderComplaints() {
    if (this.state.complaint.length !== 0) {
      return this.state.complaint.map((complaint, index) => {
        return (
          <Card key={complaint.complaintId}>
            {index === 0 && (
              <Text style={{fontWeight: 'bold', marginTop: 5, marginBottom: 8}}>
                Submitted Complaint(s)
              </Text>
            )}
            <Text category="label" style={styles.label}>
              Description
            </Text>
            <Text style={styles.word}>{complaint.description}</Text>
            <Text category="label" style={styles.label}>
              Admin Response
            </Text>
            <Text style={styles.word}>
              {complaint.adminResponse ? complaint.adminResponse : '-'}
            </Text>
            <Text category="label" style={styles.label}>
              Status
            </Text>
            <Text
              style={{
                color: '#3366FF',
                marginTop: 5,
                marginBottom: 5,
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}>
              {complaint.complaintStatus}
            </Text>
            <Text category="label" style={styles.label}>
              Created at
            </Text>
            <Text style={styles.word}>
              {this.formatDate(complaint.createdAt) +
                ', ' +
                this.formatTime(complaint.createdAt)}
            </Text>
            <Text category="label" style={styles.label}>
              Complaint ID
            </Text>
            <Text style={styles.word}>{complaint.complaintId}</Text>
          </Card>
        );
      });
    } else {
      return null;
    }
  }



  async handleVerify(requestId) {
    const description = `Transfer of $${this.state.request.amount.toFixed(2)}, Request ID: ${requestId}`;
    try {
      const response = await axios.put(
        `${globalVariable.requestApi}verify-request/`, {
          requestId: requestId
        }
      );
      
      //set state of request
      this.setState({
        request: response.data,
      });

      const allRequests = await axios.get(
        `${globalVariable.announcementApi}all-requests/${this.state.announcement.announcementId}`
      );
      
      //retrieve all the verified requests under 
      //this announcement
      const completedRequests = allRequests.data.filter(
        (request) => request.requestStatus === 'VERIFIED'
      );
      
      //if all the requests are verified meaning this announcement IS PAST (completely closed), 
      //set the announcement to PAST 
      if (completedRequests.length === allRequests.data.length) {
        await axios.put(
          `${globalVariable.announcementApi}past-announcement/${this.state.announcement.announcementId}`
        );
      }

      //pay the announcer 
      const transaction = await axios.post(
        globalVariable.transactionApi + 'process-payment',
        {
          walletId: this.props.user.Wallet.walletId,
          amount: this.state.request.amount.toString(),
          email: this.state.announcer.email,
          description: description,
        }
      );

      this.props.navigation.navigate('CommendAnnouncer', {
        announcer: this.state.announcer
      });

    } catch (error) {
      console.log(error);
      this.setState({
        message: 'Unable to verify request',
      });
    }
  }

  renderVerifyModal() {
    const avatar = () => (
      <UserAvatar
        source={
          this.state.announcer.avatarPath
            ? this.state.announcer.avatarPath
            : null
        }
      />
    );
    
    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={this.state.modalVisible}>
        <Card>
          <Text style={{fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>
            Verify Request 
          </Text>
          <ListItem
            description={
            <React.Fragment>
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                {this.state.announcer && this.state.announcer.name}
              </Text>
              <Layout style={{paddingLeft: 3, justifyContent: 'center'}}>
                {this.checkmarkIfVerified(this.state.announcer)}
              </Layout>
            </React.Fragment>
            }
            title={
              <Text style={styles.label}>
                Recipient
              </Text>
            }
            accessoryRight={avatar}
          />
          <Divider />
          <ListItem
            description={
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                {this.state.request.title}
              </Text>
            }
            title={
              <Text style={styles.label}>
                Request Title
              </Text>
            }
          />
          <Divider />
          <ListItem
            description={
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                {this.state.request.amount
                    ? `SGD ${parseFloat(this.state.request.amount).toFixed(2)}`
                    : 'Loading...'}
              </Text>
            }
            title={
              <Text style={styles.label}>
                Pay Amount
              </Text>
            }
          />
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({modalVisible: false});
                this.handleVerify(this.props.route.params.requestId);
              }}>
              Confirm
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  modalVisible: false,
                });
              }}>
              Dismiss
            </Button>
          </Layout>
        </Card>
      </Modal>
    );
  }

  renderStatus() {
    let status;
    switch (this.state.request.requestStatus || this.state.announcement.announcementStatus) {
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
          <Card style={styles.jioCard}
            onPress={() => this.props.navigation.navigate('AnnouncementDetails', {
              announcementId: this.state.announcement.announcementId
            })}
          >
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
                <TouchableOpacity
                  style={styles.userRow}
                  onPress={() => {
                    this.props.navigation.navigate('UserBadges', {
                      badges: this.state.announcer.Badges,
                      name: this.state.announcer.name,
                    });
                  }}>
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
                </TouchableOpacity>
                </View>
                <View style={styles.moreinfosubbox}>
              </View>
              </View>
            </View>
          </Card>
          <View style={styles.moreinfobox}>
            <Card style={styles.card}>
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


            {/* report an issue */}
            {renderIf(
              (this.state.request.requestStatus === 'COMPLETED' ||
                this.state.request.requestStatus === 'VERIFIED') &&
                this.state.pendingComplaints === 0,
              <MenuItem
                style={styles.report}
                title="Report an issue"
                accessoryRight={ForwardIcon}
                onPress={() =>
                  this.props.navigation.navigate('ReportScreen', {
                    request: this.state.request,
                  })
                }
              />
            )}

            {/* show complaints made*/}
            {renderIf(
              this.state.complaint.length !== 0,
              this.renderComplaints()
            )}

            {renderIf(
              this.state.request.requestStatus === 'COMPLETED',
              <Button
                style={styles.button}
                onPress={() => this.setState({modalVisible: true})}
              >
                Verify Request
              </Button>
            )}


          </View>
          <Text style={styles.description} status="danger">
              {this.state.message}
            </Text>
        </ScrollView>
        {this.renderVerifyModal()}
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
    marginBottom: 8,
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
  description: {
    textAlign: 'center',
    marginTop: 10,
  },
  buttons: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    // marginTop: 20,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    marginTop: 20,
    width: 120,
    margin: 5,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MyRequest);
