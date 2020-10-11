import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import {
  Text,
  Layout,
  Button,
  List,
  ListItem,
  Divider,
  Avatar,
  Icon,
} from '@ui-kitten/components';
import {connect} from 'react-redux';
import {setUser} from '../redux/actions';
import badgesControl from '../enum/badgesControl';
import renderIf from '../components/renderIf';

class UserBadges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //number of types of badges where badges != 0
      monthlyBadges: 0,
      allTimeBadges: 0,
      //array of user's badges
      userBadges: this.props.user.Badges,
      //view all time or monthly badges depending value is true or false
      viewMonthly: true,
      monthlyBtn: 'warning',
      allTimeBtn: 'basic',
    };
  }

  countBadges = () => {
    this.state.userBadges.forEach((badge) => {
      //count monthly badges
      if (this.state.viewMonthly && badge.monthlyCounter > 0) {
        this.state.monthlyBadges++;
      }
      //count all-time badges
      if (!this.state.viewAllTime && badge.totalCounter > 0) {
        this.state.allTimeBadges++;
      }
    });
  };

  renderContent = () => {
    let condition;
    if (this.state.viewMonthly && this.state.monthlyBadges == 0) {
      condition = true;
    } else if (!this.state.viewMonthly && this.state.allTimeBadges == 0) {
      condition = true;
    } else {
      condition = false;
    }
    console.log(this.state.monthlyBadges, this.state.allTimeBadges, condition);
    return renderIf(
      condition,
      <Text style={styles.message}>
        No Badges yet. Make an announcement to start collecting!
      </Text>,
      this.RenderBadges()
    );
  };

  RenderBadges = () => {
    //if badge count > 0, render the list item. If not, hide the list item
    const renderItem = ({item}) => {
      if (item.count > 0) {
        return (
          <ListItem
            title={`${item.title}`}
            description={`${item.description}`}
            accessoryLeft={() => {
              switch (item.title) {
                case 'EXCELLENT COMMUNICATOR':
                  return (
                    <Avatar
                      source={require('../img/excellentCommunicator.png')}
                    />
                  );
                case 'FAST AND FURIOUS':
                  return (
                    <Avatar source={require('../img/fastAndFurious.png')} />
                  );
                case 'LOCAL LOBANG':
                  return <Avatar source={require('../img/localLobang.png')} />;
                case 'SUPER NEIGHBOUR':
                  return (
                    <Avatar source={require('../img/superNeighbour.png')} />
                  );
                default:
                  return <Avatar source={require('../img/openjioLogo.jpg')} />;
              }
            }}
            accessoryRight={() => {
              return <Text style={styles.count}>{item.count}</Text>;
            }}
          />
        );
      } else {
        return null;
      }
    };

    const data = this.state.userBadges.map((badge) => {
      return {
        title: badge.name,
        description: badge.description,
        count: this.state.viewMonthly
          ? badge.monthlyCounter
          : badge.totalCounter,
      };
    });
    return (
      <List
        data={data}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      />
    );
  };
  render() {
    console.log('User badges');
    // console.log(this.props);

    const backIcon = (props) => (
      <Icon {...props} name="close-outline" width="25" height="25" />
    );

    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <View style={{backgroundColor: '#3366ff'}}>
          <Button
            style={{alignSelf: 'flex-start', flex: 1, marginTop: 50}}
            onPress={() => {
              this.props.navigation.replace('Tabs', {screen: 'Profile'});
            }}
            accessoryLeft={backIcon}
            appearance="ghost"
            status="basic"
            size="tiny"
          />
          <Text style={styles.header} category="h4">
            My Badges
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginBottom: 30,
            }}>
            <Button
              status={this.state.monthlyBtn}
              style={{width: 150}}
              onPress={() => {
                this.setState({
                  viewMonthly: true,
                  monthlyBadges: 0,
                  allTimeBadges: 0,
                  monthlyBtn: 'warning',
                  allTimeBtn: 'basic',
                });
                console.log(this.state);
              }}>
              Monthly
            </Button>
            <Button
              status={this.state.allTimeBtn}
              style={{width: 150}}
              onPress={() => {
                this.setState({
                  viewMonthly: false,
                  monthlyBadges: 0,
                  allTimeBadges: 0,
                  monthlyBtn: 'basic',
                  allTimeBtn: 'warning',
                });
                console.log(this.state);
              }}>
              All-Time
            </Button>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            {this.countBadges()}
            {this.renderContent()}
          </Layout>
        </TouchableWithoutFeedback>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    marginBottom: 20,
    fontFamily: 'Karla-Bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  button: {
    width: 150,
  },
  count: {
    fontFamily: 'Karla-Bold',
    marginLeft: 20,
    fontSize: 18,
  },
  message: {
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {setUser})(UserBadges);
