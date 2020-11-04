import React from 'react';
import {connect} from 'react-redux';
import {View, StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Layout, Button, Card} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {UserAvatar} from '../GLOBAL_VARIABLE';

class AnnouncementDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      announcementDetails: this.props.route.params.announcementDetails,
      createdBy: '',
      userRequest: '',
      submitReqButton: true,
    };
  }
  componentDidMount() {
    this.getAnnouncementDetails();
    this.getUserRequest();
  }

  dateFormat(date) {
    const dateFormat = new Date(date);
    return (
      dateFormat.getFullYear() +
      '-' +
      (dateFormat.getMonth() + 1) +
      '-' +
      dateFormat.getDate() +
      ', ' +
      dateFormat.toLocaleTimeString('en', {
        timeStyle: 'short',
        hour12: true,
        timeZone: 'Asia/Singapore',
      })
    );
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
        if (
          request.announcementId ==
          this.state.announcementDetails.announcementId
        ) {
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
            Announcement Details
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
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
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
                </TouchableOpacity>
              </View>
              <View style={{marginLeft: 40}}>
                <Text category="label" style={styles.label}>
                  Close Time
                </Text>
                <Text style={styles.word}>
                  {this.state.announcementDetails.closeTime
                    ? this.dateFormat(this.state.announcementDetails.closeTime)
                    : ''}
                </Text>
              </View>
            </View>
          </Card>
          {renderIf(
            this.state.userRequest !== '',
            <Card style={styles.card}>
              <Text
                style={{fontWeight: 'bold', marginBottom: 10}}
                category="h6">
                My Request
              </Text>
              <Text category="label" style={styles.label}>
                Title
              </Text>
              <Text style={styles.word}>
                {this.state.userRequest ? this.state.userRequest.title : ''}
              </Text>
              <Text category="label" style={styles.label}>
                Description
              </Text>
              <Text style={styles.word}>
                {this.state.userRequest && this.state.userRequest.description
                  ? this.state.userRequest.description
                  : '-'}
              </Text>
              <Text category="label" style={styles.label}>
                Amount
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.word}>
                  {this.state.userRequest && this.state.userRequest.amount
                    ? 'SGD ' +
                      parseFloat(this.state.userRequest.amount).toFixed(2)
                    : ''}
                </Text>
              </View>
              <Text category="label" style={styles.label}>
                Status
              </Text>
              <Text style={styles.word}>
                {this.state.userRequest
                  ? this.state.userRequest.requestStatus
                  : ''}
              </Text>
              <Text category="label" style={styles.label}>
                Submitted At
              </Text>
              <Text style={styles.word}>
                {this.state.userRequest && this.state.userRequest.createdAt
                  ? this.dateFormat(this.state.userRequest.createdAt)
                  : ''}
              </Text>
            </Card>
          )}

          {/* hide submit request button if announcement is made by the user */}
          {renderIf(
            this.props.user.userId != this.state.announcementDetails.userId,
            <Button
              style={styles.button}
              onPress={() =>
                this.state.submitReqButton
                  ? this.props.navigation.navigate('HealthDeclaration', {
                      announcementId: this.state.announcementDetails.announcementId,
                    })
                  : this.props.navigation.navigate('EditRequest', {
                      request: this.state.userRequest,
                    })
              }>
              {this.state.submitReqButton ? 'Submit a Request' : 'Edit Request'}
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
