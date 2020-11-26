import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Text, Layout, Divider} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      notifications: [],
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getNotifications();
    });
    this.getNotifications();
  }

  componentWillUnmount() {
    this.focusListener();
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getNotifications();
    this.setState({
      refreshing: false,
    });
  };

  renderNotifications = () => {
    return this.state.notifications.map((notification) => {
      return (
        <View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              marginTop: 10,
              marginBottom: 10,
              alignItems: 'center',
            }}
            onPress={() => {
              this.markAsRead(notification);
            }}>
            <View style={{marginLeft: 20, marginTop: 5, marginBottom: 5}}>
              <Text>{notification.title}</Text>
              <Text style={styles.description}>
                {notification.content.length > 50
                  ? `${notification.content.substring(0, 51)}...`
                  : `${notification.content}`}
              </Text>
            </View>
            {!notification.isRead && <View style={styles.circle}></View>}
          </TouchableOpacity>
          <Divider />
        </View>
      );
    });
  };

  async markAsRead(notification) {
    try {
      await axios.put(
        `${globalVariable.notificationApi}read/${notification.notificationId}`
      );
    } catch (error) {
      console.log(error);
    }
    this.props.navigation.navigate('NotificationDetails', {
      notification: notification,
    });
  }

  async getNotifications() {
    try {
      const response = await axios.get(
        `${globalVariable.notificationApi}userId/${this.props.user.userId}`
      );
      const sortedNotifications = await response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      this.setState({notifications: sortedNotifications});
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
            Notifications
          </Text>
          <Text style={styles.subTitle}>Recent</Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <View style={styles.list}>
            {renderIf(
              this.state.notifications.length !== 0,
              this.renderNotifications(),
              <Text style={{marginLeft: 15, marginTop: 10}}>
                You have no notifications.
              </Text>
            )}
          </View>
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  headerRow: {
    marginLeft: 15,
    marginRight: 15,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Karla-Bold',
  },
  subTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    marginBottom: 30,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#888888',
  },
  circle: {
    backgroundColor: '#3366FF',
    width: 10,
    height: 10,
    marginLeft: 'auto',
    marginRight: 20,
    borderRadius: 100 / 2,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Notification);
