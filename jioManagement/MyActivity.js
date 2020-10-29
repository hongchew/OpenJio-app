import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Text, Button} from '@ui-kitten/components';
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
    //this.getAnnouncements(); 
    //this.getRequests();
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
  };

  //placeholder methods
  async getAnnouncements() {
    
  }

  async getRequests() {
    
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
      <View style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="white"
          //translucent={true}
        />
        <Text style={styles.header} category="h4">
          My Activity
        </Text>

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
          {this.renderContent()}
          
        
      </View>
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
