import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, View, StyleSheet, FlatList, Image} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Text, Button, Avatar, Card} from '@ui-kitten/components';
import axios from 'axios';
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
    };
    console.log(this.props);
  }

  componentDidMount() {
    this.getAllTimeLeaderboard();
    this.getMonthlyLeaderboard();
  }

  async getAllTimeLeaderboard() {
    try {
      const response = await axios.get(
        globalVariable.userApi + 'overall-leaderboard'
      );
      this.setState({
        allTimeData: response.data,
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
      //console.log(response.data);
      this.setState({
        monthlyData: response.data,
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
    console.log('viewAllTime');
  };

  viewMonthly = () => {
    this.setState({
      viewAllTime: false,
      viewMonthly: true,
      monthlyBtn: 'primary',
      allTimeBtn: 'basic',
    });
    console.log('view Monthly');
  };

  renderItem = ({item, index}) => {
    const evenColor = this.props.evenRowColor || evenRowColor;
    const oddColor = this.props.oddRowColor || oddRowColor;
    const rowColor = index % 2 === 0 ? evenColor : oddColor;

    return (
      <View style={[styles.row, {backgroundColor: rowColor}]}>
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

          {!item.avatarPath && (
            <Avatar
              source={require('../img/defaultAvatar.png')}
              shape="rounded"
              size="small"
            />
          )}

          <Text style={styles.labelStyle} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <Text style={styles.score}>
          {this.state.viewAllTime
            ? item.badgeCountTotal
            : item.badgeCountMonthly}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.layout}>
        <FocusAwareStatusBar
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
            marginTop: 10,
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

        <Card appearance="filled">
          <FlatList
            data={
              this.state.viewAllTime
                ? this.state.allTimeData
                : this.state.monthlyData
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={(data) => this.renderItem(data)}
          />
        </Card>
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
    marginRight: 5,
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
    position: 'absolute',
    right: 15,
    paddingLeft: 15,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(LeaderboardScreen);
