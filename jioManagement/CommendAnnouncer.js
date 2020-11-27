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
  ListItem,
  Avatar,
  Button,
  Modal,
  Card,
} from '@ui-kitten/components';
import {connect} from 'react-redux';
import badgesControl from '../enum/badgesControl';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import renderIf from '../components/renderIf';

class CommendAnnouncer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //array of initialised badges
      userBadges: this.props.user.Badges,
      announcer: this.props.route.params.announcer,
      badgesGivenArr: [],
      commendBtn: false,
    };
  }

  addBadge = (badgeType) => {
    console.log(this.state.badgesGivenArr.length);
    if (!this.state.badgesGivenArr.includes(badgeType)) {
      if (this.state.badgesGivenArr.length <= 2) {
        //if this badge is not in the arr, can add
        this.setState({
          badgesGivenArr: [...this.state.badgesGivenArr, badgeType],
        });
      }
    } else {
      //if the badge is alr inside, allow user to deselect
      const filterBadgeArr = this.state.badgesGivenArr.filter(
        (badgeTypeInArr) => badgeTypeInArr !== badgeType
      );
      this.setState({
        badgesGivenArr: filterBadgeArr,
      });
    }
  };

  async handleCommendBadges() {
    try {
      const response = await axios.put(
        `${globalVariable.userApi}give-badges/`,
        {
          userId: this.props.route.params.announcer.userId,
          badgeTypes: this.state.badgesGivenArr,
        }
      );
      this.props.navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  renderContent = () =>
    //filter out SUPER_NEIGHBOUR because users cannot assign that manually
    this.state.announcer.Badges.filter(
      (badgeObj) => badgeObj.badgeType !== 'SUPER_NEIGHBOUR'
    ).map((badge) => {
      return (
        <ListItem
          style={[
            styles.card,
            this.state.badgesGivenArr.includes(badge.badgeType)
              ? {backgroundColor: '#ededed'}
              : '',
          ]}
          key={badge.badgeType}
          onPress={() => this.addBadge(badge.badgeType)}
          title={(evaProps) => (
            <Text
              {...evaProps}
              style={{
                fontSize: 17,
                marginLeft: 5,
                marginTop: 8,
                marginBottom: 8,
              }}>
              {badge.name}
            </Text>
          )}
          description={(evaProps) => (
            <Text
              {...evaProps}
              style={{
                fontSize: 14,
                marginLeft: 5,
                marginBottom: 8,
                color: 'grey',
              }}>
              {badge.description}
            </Text>
          )}
          accessoryLeft={() => {
            var listOfBadges = badgesControl;
            var img = eval('listOfBadges.badges.' + badge.badgeType + '.image');
            return (
              <Avatar
                source={img ? img : require('../img/defaultAvatar.png')}
                size="giant"
              />
            );
          }}
        />
      );
    });

  renderModal() {
    return (
      <Modal backdropStyle={styles.backdrop} visible={this.state.modalVisible}>
        <Card style={{marginLeft: 15, marginRight: 15}}>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            {renderIf(
              this.state.commendBtn && this.state.badgesGivenArr.length !== 0,
              `Verify this request as successfully completed?`,
              `Close this request without commending ${this.state.announcer.name}? You will not be able to return to this page to award these badges.`
            )}
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  modalVisible: false,
                });
                {
                  this.state.commendBtn &&
                  this.state.badgesGivenArr.length !== 0
                    ? this.handleCommendBadges()
                    : this.props.navigation.goBack();
                }
              }}>
              Confirm
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  modalVisible: false,
                });
              }}>
              Dismiss
            </Button>
          </Layout>
        </Card>
      </Modal>
    );
  }

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
          translucent={true}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={styles.container}>
            <Text style={styles.header} category="h4">
              Request Completed!
            </Text>
            <Text style={{fontSize: 18, marginBottom: 5}}>
              {this.props.route.params &&
                'Commend ' + this.props.route.params.announcer.name}
            </Text>
            <Text style={{marginBottom: 15}}>
              Select as many badges as you want and award them to{' '}
              {this.props.route.params &&
                this.props.route.params.announcer.name}
              !
            </Text>
            <View>
              {this.renderContent()}
              <View style={styles.buttons}>
                <Button
                  style={styles.button}
                  onPress={() =>
                    this.setState({modalVisible: true, commendBtn: false})
                  }>
                  Don't Commend
                </Button>
                <Button
                  style={styles.button}
                  onPress={() =>
                    this.setState({modalVisible: true, commendBtn: true})
                  }>
                  Commend
                </Button>
              </View>
            </View>
          </Layout>
        </TouchableWithoutFeedback>
        {this.renderModal()}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    marginTop: 70,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginBottom: 18,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 25,
    width: '48%',
  },
  buttons: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  count: {
    fontFamily: 'Karla-Bold',
    marginLeft: 25,
    fontSize: 20,
  },
  message: {
    textAlign: 'center',
  },
  card: {
    //backgroundColor: 'grey',
    //padding: -20,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 15,
    elevation: 5,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    marginTop: 20,
    width: 120,
    margin: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(CommendAnnouncer);
