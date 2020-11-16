import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Text,
  Layout,
  Divider,
  List,
  ListItem,
  Button,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';

class MyHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      filter: 'announcement',
      announcementBtnStatus: 'primary',
      requestBtnStatus: 'basic',
      announcements: [],
      requests: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getPastAnnouncements(this.props.user.userId);
    this.getPastRequests(this.props.user.userId);
  }

  async getPastAnnouncements(userId) {
    try {
      const response = await axios.get(
        `${globalVariable.announcementApi}all-announcements/${userId}`
      );
      const announcements = response.data;
      const pastAnnouncements = await announcements.filter(
        (announcement) => announcement.announcementStatus === 'PAST'
      );
      const sortedAnnouncements = await pastAnnouncements.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      this.setState({
        announcements: sortedAnnouncements,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getPastRequests(userId) {
    try {
      const response = await axios.get(
        `${globalVariable.requestApi}past/${userId}`
      );
      const pastRequests = response.data;
      const sortedRequests = await pastRequests.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      this.setState({
        requests: sortedRequests,
      });
    } catch (error) {
      console.log(error);
    }
  }

  viewAnnouncements = () => {
    this.setState({
      filter: 'announcement',
      announcementBtnStatus: 'primary',
      requestBtnStatus: 'basic',
    });
  };

  viewRequests = () => {
    this.setState({
      filter: 'request',
      announcementBtnStatus: 'basic',
      requestBtnStatus: 'primary',
    });
  };

  renderPastAnnouncements = ({item}) => {
    if (this.state.announcements.length === 0) {
      return (
        <ListItem
          style={styles.listItem}
          title={
            <Text style={styles.amount}>There are no past announcements.</Text>
          }
        />
      );
    } else {
      console.log('printing a past announcement')
      return (
        <ListItem
        style={styles.listItem}
        onPress={() =>
          this.props.navigation.replace('MyAnnouncement', {
            announcementId: item.announcementId,
          })
        }
        title={
          <Text style={styles.amount}>{item.destination}</Text>
        }
        description={
          <Text style={styles.description}>{item.description}</Text>
        }
      />
      );
    }
  };

  renderPastRequests = ({item}) => {
    if (this.state.requests.length === 0) {
      return (
        <ListItem
          style={styles.listItem}
          title={
            <Text style={styles.amount}>There are no past requests.</Text>
          }
        />
      );
    } else {
      console.log('printing a past request')
      return (
        <ListItem
        style={styles.listItem}
        onPress={() =>
          this.props.navigation.replace('MyRequest', {
            requestId: item.requestId,
          })
        }
        title={
          <Text style={styles.amount}>{item.title}</Text>
        }
        description={
          <Text style={styles.description}>{item.description}</Text>
        }
      />
      );
    }
  };

  renderItem = ({item}) => {
    if (item.senderWalletId === this.state.user.Wallet.walletId) {
      return (
        <ListItem
          style={styles.listItem}
          onPress={() =>
            this.props.navigation.replace('MyActivity', {
              announcement: announcement,
            })
          }
          title={
            <Text style={styles.amount}>- SGD ${item.amount.toFixed(2)}</Text>
          }
          description={
            <Text style={styles.description}>{item.description}</Text>
          }
        />
      );
    } else {
      return (
        <ListItem
          style={styles.listItem}
          onPress={() =>
            this.props.navigation.replace('TransactionDetails', {
              transactionId: item.transactionId,
            })
          }
          title={
            <Text style={styles.amount}>{item.amount.toFixed(2)}</Text>
          }
          description={
            <Text style={styles.description}>{item.description}</Text>
          }
        />
      );
    }
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <Text style={styles.header} category="h4">
          My History
        </Text>
        <View style={styles.transactionTab}>
          <Button
            status={this.state.announcementBtnStatus}
            style={styles.buttonItem}
            onPress={this.viewAnnouncements}>
            Announcements
          </Button>
          <Button
            status={this.state.requestBtnStatus}
            style={styles.buttonItem}
            onPress={this.viewRequests}>
            Requests
          </Button>
        </View>
        {renderIf(
          this.state.filter === 'announcement',
          <Text style={styles.action}>Recent Announcements</Text>,
          <Text style={styles.action}>Recent Requests</Text>
        )}
        <View style={styles.transactionList}>
          {renderIf(
            this.state.filter === 'announcement',
            <List
              style={styles.listContainer}
              data={this.state.announcements}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderPastAnnouncements}
            />
          )}
          {renderIf(
            this.state.filter === 'request',
            <List
              style={styles.listContainer}
              data={this.state.requests}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderPastRequests}
            />
          )}
        </View>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  header: {
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  action: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
  },
  buttonItem: {
    width: 150,
  },
  transactionList: {
    marginBottom: 30,
    flex: 1,
  },
  transactionTab: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  amount: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#888888',
  },
  listItem: {
    marginLeft: 10,
    marginRight: 10,
  },
  listContainer: {
    backgroundColor: 'white',
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MyHistory);
