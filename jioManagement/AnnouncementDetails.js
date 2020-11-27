import React from 'react';
import {connect} from 'react-redux';
import {View, StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Layout, Button, Card, Icon} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {UserAvatar} from '../GLOBAL_VARIABLE';

class AnnouncementDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      announcementId: this.props.route.params
        ? this.props.route.params.announcementId
        : '',
      createdBy: '',
      userRequest: '',
      announcementDetails: '',
      submitReqButton: true,
    };
  }
  componentDidMount() {
    this.retrieveAnnouncementById(this.props.route.params.announcementId);
    this.getUserRequest();

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.retrieveAnnouncementById(this.props.route.params.announcementId);
      this.getUserRequest();
    });
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

  formatTime(date) {
    //convert to 12-hour clock
    const newDate = new Date(date);
    var hours = newDate.getHours();
    var amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    var minutes = newDate.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var formattedTime = hours + ':' + minutes + ' ' + amOrPm;
    return formattedTime;
  }

  formatDate(date) {
    const newDate = new Date(date);
    var formattedDate =
      newDate.getFullYear() +
      '-' +
      (newDate.getMonth() + 1) +
      '-' +
      newDate.getDate();

    return formattedDate;
  }

  async retrieveAnnouncementById(announcementId) {
    try {
      const announcement = await axios.get(
        globalVariable.announcementApi + 'by/' + announcementId
      );

      const address = await axios.get(
        `${globalVariable.addressApi}retrieve-addressId/${announcement.data.startLocation}`
      );
      this.setState({
        announcementDetails: announcement.data,
        startLocation:
          address.data.line1 +
          ', ' +
          address.data.country +
          ' ' +
          address.data.postalCode,
      });
      this.getAnnouncementDetails();
    } catch (error) {
      console.log(error);
    }
  }

  async getAnnouncementDetails() {
    try {
      const responseUser = await axios.get(
        globalVariable.userApi + this.state.announcementDetails.userId
      );
      this.setState({
        createdBy: {
          name: responseUser.data.name,
          badges: responseUser.data.Badges,
          img: responseUser.data.avatarPath,
          isSingPassVerified: responseUser.data.isSingPassVerified,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getUserRequest() {
    try {
      const responseRequests = await axios.get(
        globalVariable.requestApi + 'by-userId/' + this.props.user.userId
      );
      responseRequests.data.forEach((request) => {
        if (request.announcementId == this.state.announcementId) {
          this.setState({
            userRequest: request,
            submitReqButton: false,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //to show new request under announcement details after redirecting from user making a new request
  //otherwise, only announcement details without the new request is shown after the redirect
  componentDidUpdate(prevProps) {
    if (this.props.route.params != prevProps.route.params) {
      this.setState({
        userRequest: this.props.route.params.userRequest,
        submitReqButton: this.props.route.params.userRequest ? false : true,
      });
    }
  }

  renderJioStatus() {
    let status;
    switch (this.state.announcementDetails.announcementStatus) {
      case 'ACTIVE':
        status = 'Active';
        break;
      case 'ONGOING':
        status = 'Ongoing';
        break;
      case 'COMPLETED':
        status = 'Completed';
        break;
      case 'PAST':
        status = 'Past';
        break;
    }
    return <Text style={{color: 'white', textAlign: 'center'}}>{status}</Text>;
  }

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
            Jio Details
          </Text>
        </View>
        <ScrollView style={styles.container}>
          <Card style={styles.card}>
            <Text category="label" style={styles.label}>
              Destination
            </Text>
            <Text style={{fontWeight: 'bold'}} category="h5">
              {this.state.announcementDetails.destination}
            </Text>

            <Text category="label" style={styles.label}>
              Description
            </Text>
            <Text style={styles.word}>
              {this.state.announcementDetails.description}
            </Text>

            <Text category="label" style={styles.label}>
              Start Location
            </Text>
            <Text style={styles.word}>{this.state.startLocation}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View>
                <Text category="label" style={styles.label}>
                  Status
                </Text>
                <View style={styles.status}>{this.renderJioStatus()}</View>
              </View>
              <View style={{marginLeft: 40}}>
                <Text category="label" style={styles.label}>
                  Close Time
                </Text>
                <Text style={styles.word}>
                  {this.state.announcementDetails.closeTime
                    ? this.formatDate(
                        this.state.announcementDetails.closeTime
                      ) +
                      ', ' +
                      this.formatTime(this.state.announcementDetails.closeTime)
                    : ''}
                </Text>
              </View>
            </View>

            <View>
              <Text category="label" style={styles.label}>
                Submitted By
              </Text>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() =>
                  this.props.navigation.navigate('UserBadges', {
                    badges: this.state.createdBy.badges,
                    name: this.state.createdBy.name,
                  })
                }
                style={styles.userRow}>
                <UserAvatar
                  source={
                    this.state.createdBy.img ? this.state.createdBy.img : null
                  }
                  size="small"></UserAvatar>
                <Text style={styles.name}>
                  {this.state.createdBy.name ? this.state.createdBy.name : ''}
                </Text>
                <Layout style={{paddingLeft: 3, justifyContent: 'center'}}>
                  {this.checkmarkIfVerified(this.state.createdBy)}
                </Layout>
              </TouchableOpacity>
            </View>
          </Card>

          {/* hide submit request button if announcement is made by the user */}
          {renderIf(
            this.props.user.userId != this.state.announcementDetails.userId,
            <Button
              style={styles.button}
              onPress={() =>
                this.props.navigation.replace('HealthDeclaration', {
                  announcementId: this.state.announcementDetails.announcementId,
                })
              }
              disabled={!this.state.submitReqButton}>
              {this.state.submitReqButton
                ? 'Submit a Request'
                : 'Request Submitted'}
            </Button>
          )}
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
  card: {
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
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
  label: {
    marginTop: 10,
    color: 'grey',
  },
  word: {
    marginTop: 10,
    marginBottom: 8,
    lineHeight: 22,
  },
  userRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  name: {
    marginLeft: 10,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(AnnouncementDetails);
