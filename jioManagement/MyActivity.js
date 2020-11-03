import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Text, Button, Layout} from '@ui-kitten/components';
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
      viewAnnouncement: true,
      announcementBtn: 'primary',
      requestBtn: 'basic',
      announcements: [],
      requests: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    console.log('running componentDidMount')
    this.getAnnouncements(this.props.user.userId); 
    this.getRequests(this.props.user.userId);
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getAnnouncements(this.props.user.userId); 
    this.getRequests(this.props.user.userId);
    this.setState({
      refreshing: false
    })
  };

  //To get all active announcements
  async getAnnouncements(userId) {
    try{
      const response = await axios.get(
        `${globalVariable.announcementApi}all-announcements/${userId}`
      )
      const announcements = response.data
      const activeAnnouncements = await announcements.filter((announcement) =>
        announcement.announcementStatus !== 'PAST'
      )
      this.setState({
        announcements: activeAnnouncements
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getRequests(userId) {
    try {
      const response = await axios.get(
        `${globalVariable.requestApi}ongoing/${userId}`
      )
      const requests = response.data
      this.setState({
        requests: requests
      })
    } catch (error) {
      console.log (error)
    }
  }

  viewAnnouncements = () => {
    this.setState({
      viewAnnouncement: true,
      announcementBtn: 'primary',
      requestBtn: 'basic',
    });
  };

  viewRequests = () => {
    this.setState({
      viewAnnouncement: false,
      announcementBtn: 'basic',
      requestBtn: 'primary',
    });
  };

  
  

  renderContent = () => {
    if (this.state.viewAnnouncement && this.state.announcements.length === 0) {
      return (
        <Text style={styles.message}>There is no announcements yet.</Text>
      );
    } else if (!this.state.viewAnnouncement && this.state.requests.length === 0) {
      return (
        <Text style={styles.message}>There is no requests yet.</Text>
      );
    } 
  }

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="white"
          //translucent={true}
        />
        <View style={styles.headerRow}>
            <Text style={styles.header} category="h4">
              My Activity
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('PaymentSettings')}>
              <Text style={styles.history} status='basic'>History</Text>
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
            status={this.state.announcementBtn}
            style={{width: 150}}
            onPress={() => this.viewAnnouncements()}>
            Announcements
          </Button>
          <Button
            status={this.state.requestBtn}
            style={{width: 150}}
            onPress={() => this.viewRequests()}>
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
    marginTop: 65
  },
  row: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#d6d7da',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankIconStyle: {
    marginRight: 10,
    marginLeft: 10,
    width: 30,
    height: 30,
  },
  rank: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 4,
    marginRight: 14,
  },
  singleDidget: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  doubleDidget: {
    paddingLeft: 10,
    paddingRight: 2,
  },
  labelStyle: {
    fontSize: 17,
    marginLeft: 15,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    right: 15,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MyActivity);
