import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Layout,
  Button,
  Icon,
  Divider,
  Avatar,
} from '@ui-kitten/components';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';

class SupportTickets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      tickets: [],
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getSupportTickets(this.props.user.userId)
    })
    this.getSupportTickets(this.props.user.userId);
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getSupportTickets(this.props.user.userId);
    this.setState({
      refreshing: false,
    });
  };

  componentWillUnmount () {
    this.focusListener()
  }

  //obtain list of support tickets
  async getSupportTickets(userId) {
    try {
      const response = await axios.get(
        `${globalVariable.supportTicketApi}tickets-by/${userId}`
      );
      const tickets = response.data;
      const sortedTickets = await tickets.sort(
        (a,b,) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      console.log(sortedTickets);
      this.setState({
        tickets: sortedTickets,
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderItem = () => {
    return this.state.tickets.map((ticket, index) => {
      {
        return (
          <View key={ticket.supportTicketId}>
            <TouchableOpacity
              style={styles.ticketRow}
              onPress={() =>
                this.props.navigation.navigate('SupportTicketDetails', {
                  supportTicketId: ticket.supportTicketId,
                })
              }>
              {
                renderIf(
                  ticket.supportType === 'PROFILE',
                  <Avatar style={styles.avatar} size='giant' source={require('../img/supportType_profile.png')}/>
                )
              }
              {
                renderIf(
                  ticket.supportType === 'SYSTEM',
                  <Avatar style={styles.avatar} size='giant' source={require('../img/supportType_system.png')}/>
                )
              }
              {
                renderIf(
                  ticket.supportType === 'PAYMENT',
                  <Avatar style={styles.avatar} size='giant' source={require('../img/supportType_payment.png')}/>
                )
              }
              {
                renderIf(
                  ticket.supportType === 'JIO',
                  <Avatar style={styles.avatar} size='giant' source={require('../img/supportType_jio.png')}/>
                )
              }
              {
                renderIf(
                  ticket.supportType === 'REQUEST',
                  <Avatar style={styles.avatar} size='giant' source={require('../img/supportType_request.png')}/>
                )
              }
              {
                renderIf(
                  ticket.supportType === 'HEALTH',
                  <Avatar style={styles.avatar} size='giant' source={require('../img/supportType_health.png')}/>
                )
              }
              {
                renderIf(
                  ticket.SupportComments.length > 0 && ticket.SupportComments[0].isPostedByAdmin && ticket.supportStatus === 'PENDING',
                  <View style={{flex:1,flexDirection: 'column'}}>
                    <Text style={{marginBottom: 5, fontWeight: 'bold'}}>{ticket.title}</Text>
                    <Text style={{fontSize: 13, fontWeight: 'bold'}}>{ticket.description.length > 25 ? `${ticket.description.substring(0,26)}...`: `${ticket.description}`}</Text>
                  </View>
                )
              }
              {
                renderIf(
                  ticket.SupportComments.length === 0 || ticket.SupportComments[0].isPostedByAdmin === false || ticket.supportStatus === 'RESOLVED',
                  <View style={{flex:1,flexDirection: 'column'}}>
                    <Text style={{marginBottom: 5}}>{ticket.title}</Text>
                    <Text style={{fontSize: 13}}>{ticket.description.length > 25 ? `${ticket.description.substring(0,26)}...`: `${ticket.description}`}</Text>
                  </View>
                )
              }
              <Text style={styles.ticketStatus}>{ticket.supportStatus}</Text>
            </TouchableOpacity>
            <Divider/>
          </View>
        );
      }
    });
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
        <View style={styles.headerRow}>
          <Text style={styles.header} category="h4">
            Support Inbox
          </Text>
          <Text style={styles.subtitle}>
            Reach out to our team for difficulties!
          </Text>
          <Text style={styles.recentSupportTitle}>Recent</Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <View>
            {renderIf(
              this.state.tickets.length === 0,
              <View style={styles.noticket}>
                <Image
                  source={require('../img/NoSupportTicket.png')}
                  style={styles.imageContainer}
                />
                <Text style={styles.subtitle}>Nothing at the moment</Text>
              </View>
            )}
            {this.renderItem()}
          </View>
        </ScrollView>
        <View style={styles.buttonRow}>
          <Button
            style={styles.button}
            onPress={() => this.props.navigation.navigate('AddSupportTicket')}>
            NEW SUPPORT
          </Button>
        </View>
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
  subtitle: {
    marginBottom: 20,
    color: 'grey',
    flexWrap: 'wrap',
  },
  recentSupportTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  noticket: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  imageContainer: {
    width: 250,
    height: 250,
  },
  ticketRow: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  avatar: {
    marginLeft: 20,
    marginRight: 20
  },
  ticketStatus: {
    justifyContent: 'flex-end', 
    textAlign: 'right', 
    marginRight: 20
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(SupportTickets);
