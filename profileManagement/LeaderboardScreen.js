import React from 'react';
import {connect} from 'react-redux';
import {
  StatusBar,
  View,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Text, Button} from '@ui-kitten/components';
import axios from 'axios';
import {UserAvatar} from '../GLOBAL_VARIABLE';
import {globalVariable} from '../GLOBAL_VARIABLE';

//to make sure the status bar change to certain colour only on this page
function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

const oddRowColor = 'white';
const evenRowColor = '#f2f5f7';

class LeaderboardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      viewAllTime: true,
      viewMonthly: false,
      monthlyBtn: 'basic',
      allTimeBtn: 'primary',
      allTimeData: [],
      monthlyData: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getAllTimeLeaderboard();
    this.getMonthlyLeaderboard();
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getAllTimeLeaderboard();
    this.getMonthlyLeaderboard();
  };

  async getAllTimeLeaderboard() {
    try {
      const response = await axios.get(
        globalVariable.userApi + 'overall-leaderboard'
      );
      this.setState({
        allTimeData: response.data,
        refreshing: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getMonthlyLeaderboard() {
    try {
      const response = await axios.get(
        globalVariable.userApi + 'monthly-leaderboard'
      );
      this.setState({
        monthlyData: response.data,
        refreshing: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  viewAllTime = () => {
    this.setState({
      viewAllTime: true,
      viewMonthly: false,
      monthlyBtn: 'basic',
      allTimeBtn: 'primary',
    });
  };

  viewMonthly = () => {
    this.setState({
      viewAllTime: false,
      viewMonthly: true,
      monthlyBtn: 'primary',
      allTimeBtn: 'basic',
    });
  };

  renderItem = ({item, index}) => {
    const evenColor = this.props.evenRowColor || evenRowColor;
    const oddColor = this.props.oddRowColor || oddRowColor;
    const rowColor = index % 2 === 0 ? evenColor : oddColor;

    return (
      <TouchableOpacity
        style={[styles.row, {backgroundColor: rowColor}]}
        onPress={() => {
          this.props.navigation.navigate('UserBadges', {
            badges: item.Badges,
            name: item.name,
          });
        }}
        activeOpacity={0.7}>
        <View style={styles.left}>
          {index == 0 && (
            <Image
              source={require('../img/1st.png')}
              style={styles.rankIconStyle}
            />
          )}
          {index == 1 && (
            <Image
              source={require('../img/2nd.png')}
              style={styles.rankIconStyle}
            />
          )}
          {index == 2 && (
            <Image
              source={require('../img/3rd.png')}
              style={styles.rankIconStyle}
            />
          )}
          {index > 2 && (
            <Text
              style={[
                styles.rank,
                index < 9 ? styles.singleDidget : styles.doubleDidget,
              ]}>
              {parseInt(index) + 1}
            </Text>
          )}
          <UserAvatar source={item.avatarPath ? item.avatarPath : null} />

          <Text style={styles.labelStyle} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <Text style={styles.score}>
          {this.state.viewAllTime
            ? item.badgeCountTotal
            : item.badgeCountMonthly}
        </Text>
      </TouchableOpacity>
    );
  };

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
          Leaderboard
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            marginBottom: 20,
            alignSelf: 'center',
          }}>
          <Button
            status={this.state.allTimeBtn}
            style={{width: 150}}
            onPress={() => this.viewAllTime()}>
            All-Time
          </Button>
          <Button
            status={this.state.monthlyBtn}
            style={{width: 150}}
            onPress={() => this.viewMonthly()}>
            Monthly
          </Button>
        </View>

        <FlatList
          data={
            this.state.viewAllTime
              ? this.state.allTimeData
              : this.state.monthlyData
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={(data) => this.renderItem(data)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              title="Hello"
            />
          }
        />
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
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(LeaderboardScreen);
