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
      userBadges: this.props.route.params
        ? this.props.route.params.badges
        : this.props.user.Badges,
      //view all time or monthly badges depending value is true or false
      viewMonthly: true,
      monthlyBtn: 'primary',
      allTimeBtn: 'basic',
    };
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.viewType === 'allTime') {
      this.setState({
        viewMonthly: false,
        monthlyBtn: 'basic',
        allTimeBtn: 'primary',
      })
    }
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
    return renderIf(
      condition,
      <Text style={styles.message}>No badges yet.</Text>,
      this.RenderBadges()
    );
  };

  RenderBadges = () => {
    const data = this.state.userBadges.map((badge) => {
      return {
        title: badge.name,
        description: badge.description,
        count: this.state.viewMonthly
          ? badge.monthlyCounter
          : badge.totalCounter,
        badgeType: badge.badgeType,
      };
    });

    //if badge count > 0, render the list item. If not, hide the list item
    const renderItem = ({item}) => {
      if (item.count > 0) {
        return (
          <ListItem
            style={{height: 90}}
            title={(evaProps) => (
              <Text
                {...evaProps}
                style={{fontSize: 17, marginLeft: 5, marginBottom: 5}}>
                {item.title}
              </Text>
            )}
            description={(evaProps) => (
              <Text
                {...evaProps}
                style={{fontSize: 14, marginLeft: 5, color: 'grey'}}>
                {item.description}
              </Text>
            )}
            accessoryLeft={() => {
              var listOfBadges = badgesControl;
              var img = eval(
                'listOfBadges.badges.' + item.badgeType + '.image'
              );
              return (
                <Avatar
                  source={img ? img : require('../img/defaultAvatar.png')}
                  size="giant"
                />
              );
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

    return (
      <List
        data={data}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      />
    );
  };
  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <View>
          <Text style={styles.header} category="h4">
            {this.props.route.params
              ? this.props.route.params.name + "'s Badges"
              : 'My Badges'}
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
                  monthlyBtn: 'primary',
                  allTimeBtn: 'basic',
                });
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
                  allTimeBtn: 'primary',
                });
              }}>
              All-Time
            </Button>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <View>
              {this.countBadges()}
              {this.renderContent()}
            </View>
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
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  button: {
    width: 150,
  },
  count: {
    fontFamily: 'Karla-Bold',
    marginLeft: 25,
    fontSize: 20,
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
