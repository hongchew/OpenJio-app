import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {
  Text,
  Layout,
  Input,
  Button,
  List,
  ListItem,
  Divider,
  Avatar,
} from '@ui-kitten/components';
import {connect} from 'react-redux';
import loginStyle from '../styles/loginStyle';
import {setUser} from '../redux/actions';
import badgesControl from '../enum/badgesControl';

class UserBadges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log('User badges');
    console.log(this.props);

    //array of user badges
    const badges = this.props.user.Badges;
    const data = badges.map((badge) => {
      return {
        title: badge.name,
        description: badge.description,
        monthlyCounter: badge.monthlyCounter,
      };
    });
    const renderItem = ({item, index}) => (
      <ListItem
        title={`${item.title}`}
        description={`${item.description}`}
        accessoryLeft={() => {
          switch (item.title) {
            case 'EXCELLENT COMMUNICATOR':
              return (
                <Avatar source={require('../img/excellentCommunicator.png')} />
              );
            case 'FAST AND FURIOUS':
              return <Avatar source={require('../img/fastAndFurious.png')} />;
            case 'LOCAL LOBANG':
              return <Avatar source={require('../img/localLobang.png')} />;
            case 'SUPER NEIGHBOUR':
              return <Avatar source={require('../img/superNeighbour.png')} />;
            default:
              return <Avatar source={require('../img/openjioLogo.jpg')} />;
          }
        }}
        accessoryRight={() => {
          return <Text style={styles.text}>{item.monthlyCounter}</Text>;
        }}
      />
    );

    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <Text style={styles.header} category="h4">
          My Badges
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <List
              data={data}
              ItemSeparatorComponent={Divider}
              renderItem={renderItem}
            />
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
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 30,
  },
  // circle: {
  //   backgroundColor: '#0456c9',
  //   color: 'white',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 50,
  //   textAlign: 'center',
  //   display: 'flex',
  //   paddingLeft: 5,
  //   paddingRight: 5,
  // },
  text: {
    fontFamily: 'Karla-Bold',
    marginLeft: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {setUser})(UserBadges);
