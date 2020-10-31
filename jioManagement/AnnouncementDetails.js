import React from 'react';
import {connect} from 'react-redux';
import {View, StatusBar, StyleSheet} from 'react-native';
import {Text, Layout, Button, Card} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class AnnouncementDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   announcementId: this.props.routes.params.announcementId,
      announcementId: 'd3bbb953-7aa1-414c-9876-a7add8b17c78',
      announcementDetails: '',
      createdBy: '',
    };
  }
  componentDidMount() {
    this.getAnnouncementDetails();
  }

  async getAnnouncementDetails() {
    try {
      const responseDetails = await axios.get(
        globalVariable.announcementApi + 'by/' + this.state.announcementId
      );
      const responseUser = await axios.get(
        globalVariable.userApi + responseDetails.data.userId
      );
      console.log(responseUser);
      //   console.log(responseUser);
      this.setState({
        announcementDetails: responseDetails.data,
        createdBy: {
          name: responseUser.data.name,
          email: responseUser.data.email,
          badges: responseUser.data.Badges,
        },
      });
    } catch (error) {
      console.log(error);
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

            <Text category="label" style={styles.label}>
              Close Time
            </Text>
            <Text style={styles.word}>
              {/* {new Date(this.state.announcementDetails.closeTime).toString()} */}
              {new Date(
                this.state.announcementDetails.closeTime
              ).toLocaleTimeString('en', {
                timeStyle: 'short',
                hour12: true,
                timeZone: 'UTC',
              })}
            </Text>

            <Text category="label" style={styles.label}>
              Submitted by
            </Text>
            <Text
              style={styles.word}
              onPress={() =>
                this.props.navigation.navigate('UserBadges', {
                  badges: this.state.createdBy.badges,
                  name: this.state.createdBy.name,
                })
              }>
              {this.state.createdBy.name +
                ' (' +
                this.state.createdBy.email +
                ')'}
            </Text>
          </Card>
          <Card style={styles.card}>
            <Text>my request</Text>
          </Card>
          <Button
            style={styles.button}
            onPress={() => this.props.navigation.navigate('MakeRequest')}>
            Submit a Request
          </Button>
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
  button: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(AnnouncementDetails);
