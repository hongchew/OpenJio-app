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
  Button,
  Icon,
  Modal,
  MenuItem,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {UserAvatar} from '../GLOBAL_VARIABLE';
import axios from 'axios';

const ForwardIcon = (props) => <Icon {...props} name="arrow-ios-forward" />;

class RequestDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      request: {},
      announcer: {},
      announcement: {},
      requestUserAddress: {},
      requestUser: {},
      modalVisible: false,
      acceptBtnClicked: '',
      complaint: [],
      pendingComplaints: '',
      completeBtnClicked: '',
    };
  }

  componentDidMount() {
    const requestId = this.props.route.params.requestId;
    this.getRequest(requestId);
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getRequest(requestId)
    })
  }

  componentWillUnmount () {
    this.focusListener()
  }

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

  async handleRequest() {
    try {
      //if announcement status is ONGOING, don't allow the announcer to accept any requests
      if (
        this.state.announcement.announcementStatus !== 'ONGOING' &&
        this.state.acceptBtnClicked
      ) {
        await axios.put(globalVariable.requestApi + 'schedule-request', {
          requestId: this.state.request.requestId,
        });
      }
      if (!this.state.acceptBtnClicked) {
        await axios.put(globalVariable.requestApi + 'reject-request', {
          requestId: this.state.request.requestId,
        });
      }
      this.props.navigation.replace('RequestDetails', {
        requestId: this.state.request.requestId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async handleCompleteRequest() {
    try {
      await axios.put(globalVariable.requestApi + 'complete-request', {
        requestId: this.state.request.requestId,
      });

      const allRequests = await axios.get(
        `${globalVariable.announcementApi}all-requests/${this.state.announcement.announcementId}`
      );

      const acceptedRequests = allRequests.data.filter(
        (request) =>
          request.requestStatus === 'DOING' ||
          request.requestStatus === 'COMPLETED'
      );

      //retrieve all the accepted requests under
      //this announcement that are completed
      const completedRequests = allRequests.data.filter(
        (request) => request.requestStatus === 'COMPLETED'
      );

      //if the announcer has completed all the requests,
      //set the announcement to COMPLETED
      if (acceptedRequests.length === completedRequests.length) {
        await axios.put(
          `${globalVariable.announcementApi}complete-announcement/${this.state.announcement.announcementId}`
        );
      }

      this.props.navigation.replace('RequestDetails', {
        requestId: this.state.request.requestId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //obtain the full list of transactions, credit and debit transactions
  async getRequest(requestId) {
    try {
      const response = await axios.get(
        `${globalVariable.requestApi}by-requestId/${requestId}`
      );
      const requestUser = await axios.get(
        `${globalVariable.userApi}${response.data.userId}`
      );
      const requestAddress = await axios.get(
        `${globalVariable.addressApi}retrieve-addressId/${requestUser.data.defaultAddressId}`
      );
      const complaint = await axios.get(
        `${globalVariable.complaintApi}all-complaints/${requestId}`
      );

      const sortedComplaints = await complaint.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      //set state of request
      this.setState({
        request: response.data,
        requestUser: requestUser.data,
        requestUserAddress: requestAddress.data,
        complaint: sortedComplaints.filter(
          (complaint) => complaint.complainerUserId === this.props.user.userId
        ),
        pendingComplaints: sortedComplaints.filter(
          (complaint) =>
            complaint.complaintStatus === 'PENDING' &&
            complaint.complainerUserId === this.props.user.userId
        ).length,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.get(
        `${globalVariable.announcementApi}by/${this.state.request.announcementId}`
      );
      this.setState({
        announcement: response.data,
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
      <Text
        style={{
          color: '#3366FF',
          marginTop: 5,
          marginBottom: 8,
          fontWeight: 'bold',
        }}>
        {status}
      </Text>
    );
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

  renderModal() {
    return (
      <Modal backdropStyle={styles.backdrop} visible={this.state.modalVisible}>
        <Card style={{marginLeft: 10, marginRight: 10}}>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            {this.state.acceptBtnClicked &&
              'Are you sure you want to accept this request? This request will be scheduled after you accept.'}
            {!this.state.acceptBtnClicked &&
              !this.state.completeBtnClicked &&
              'Are you sure you want to reject this request?'}
            {this.state.completeBtnClicked && (
              <Text>
                <Text style={{fontWeight: 'bold'}}>
                  Do you want to complete the request?
                </Text>
                {'\n\n'}
                <Text style={{fontStyle: 'italic'}}>
                  A request is completed only when you have fulfilled all
                  request details and description.{' '}
                </Text>
              </Text>
            )}
          </Text>
          <View style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  modalVisible: false,
                });
                {
                  this.state.completeBtnClicked && this.handleCompleteRequest();
                }
                {
                  this.state.acceptBtnClicked && this.handleRequest();
                }
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
          </View>
        </Card>
      </Modal>
    );
  }

  render() {
    return (
      <Layout style={styles.layout}>
        <ScrollView>
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor="transparent"
          />
          <Text style={styles.header} category="h4">
            {this.state.requestUser.name}'s Request Details
          </Text>

          <View style={styles.moreinfobox}>
            <Card style={styles.card}>
              <View style={styles.moreinfosubbox}>
                <Text category="label" style={styles.label}>
                  Title
                </Text>
                <Text
                  style={{fontWeight: 'bold', marginTop: 5, marginBottom: 8}}
                  category="h6">
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
                  Address
                </Text>
                <Text style={{marginTop: 5, marginBottom: 8}}>
                  {this.state.requestUserAddress.line1},{' '}
                  {this.state.requestUserAddress.country}{' '}
                  {this.state.requestUserAddress.postalCode}
                </Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text category="label" style={styles.label}>
                  Status
                </Text>
                {this.renderStatus()}
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
                  Submitted by
                </Text>
                <TouchableOpacity
                  activeOpacity={0.3}
                  onPress={() =>
                    this.props.navigation.navigate('UserBadges', {
                      badges: this.state.requestUser.Badges,
                      name: this.state.requestUser.name,
                    })
                  }
                  style={styles.userRow}>
                  <UserAvatar
                    source={this.state.requestUser.avatarPath}
                    size="small"
                  />
                  <Text style={[styles.word, {marginLeft: 10}]}>
                    {this.state.requestUser.name}
                  </Text>
                  <Layout style={{paddingLeft: 3, justifyContent: 'center'}}>
                    {this.checkmarkIfVerified(this.state.requestUser)}
                  </Layout>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 10}}>
                {
                  renderIf(
                    this.state.requestUser.hasSymptoms ||
                      this.state.requestUser.onSHN
                  ,
                  (
                    <Text category="label" style={styles.label}>
                      {this.state.requestUser.name}'s' COVID-19 Risk Level
                    </Text>
                  ))
                }
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  {this.state.requestUser.hasSymptoms && (
                    <View style={styles.highRisk}>
                      <Text style={{color: 'white'}}>Has symptoms</Text>
                    </View>
                  )}
                  {this.state.requestUser.onSHN && (
                    <View style={styles.snh}>
                      <Text style={{color: 'white'}}>SNH Notice</Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>

            {renderIf(
              this.state.request.requestStatus === 'PENDING' &&
                this.state.announcement.announcementStatus === 'ACTIVE',
              <View style={styles.buttons}>
                <Button
                  size="small"
                  style={styles.button}
                  onPress={() => {
                    this.setState({modalVisible: true, acceptBtnClicked: true});
                  }}>
                  Accept
                </Button>
                <Button
                  size="small"
                  style={styles.button}
                  onPress={() => {
                    this.setState({
                      modalVisible: true,
                      acceptBtnClicked: false,
                    });
                  }}>
                  Reject
                </Button>
              </View>
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
              this.state.request.requestStatus === 'DOING',
              <View>
                <Button
                  style={{marginLeft: 15, marginRight: 15}}
                  onPress={() => {
                    this.setState({
                      modalVisible: true,
                      completeBtnClicked: true,
                    });
                  }}>
                  Complete this Request
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
        {this.renderModal()}
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
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#F5F5F5',
    fontFamily: 'Karla-Bold',
  },
  jioCard: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
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
    height: 40,
    width: '48%',
  },
  label: {
    marginTop: 5,
    color: 'grey',
  },
  word: {
    marginTop: 8,
    marginBottom: 10,
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
  },
  lowRisk: {
    backgroundColor: '#24B750',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  highRisk: {
    backgroundColor: '#B71F3A',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 10,
  },
  snh: {
    backgroundColor: '#D89428',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  userRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
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

export default connect(mapStateToProps)(RequestDetails);
