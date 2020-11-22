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
import {Text, Layout, Card, Button, Icon, Modal} from '@ui-kitten/components';
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
    };
  }

  componentDidMount() {
    const requestId = this.props.route.params.requestId;
    this.getRequest(requestId);
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
      if (this.state.acceptBtnClicked) {
        await axios.put(globalVariable.requestApi + 'schedule-request', {
          requestId: this.state.request.requestId,
        });
        //change status of announcement to ongoing once it has accepted a request
        if (this.state.announcement.announcementStatus === 'ACTIVE') {
          await axios.put(
            globalVariable.announcementApi +
              'ongoing-announcement/' +
              this.state.announcement.announcementId
          );
        }
      } else {
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

      //set state of request
      this.setState({
        request: response.data,
        requestUser: requestUser.data,
        requestUserAddress: requestAddress.data,
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

  renderModal() {
    return (
      <Modal backdropStyle={styles.backdrop} visible={this.state.modalVisible}>
        <Card>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            {renderIf(
              this.state.acceptBtnClicked,
              'Are you sure you want to accept this request?',
              'Are you sure you want to reject this request?'
            )}
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  modalVisible: false,
                });
                this.handleRequest();
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
            </Card>

            {renderIf(
              this.state.request.requestStatus === 'PENDING',
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
