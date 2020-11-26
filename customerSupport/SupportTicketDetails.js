import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Divider,
  Input,
  Button,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';

class SupportTicketDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      ticket: '',
      newComment: null,
      showTime: false,
    };
  }

  componentDidMount() {
    this.getSupportTicket(this.props.route.params.supportTicketId);
  }

  //obtain list of support tickets
  async getSupportTicket(supportTicketId) {
    try {
      const response = await axios.get(
        `${globalVariable.supportTicketApi}ticket-info/${supportTicketId}`
      );
      const ticket = response.data;
      //sort the SupportComments array from the oldest to the newest
      await ticket.SupportComments.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      this.setState({
        ticket: ticket,
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderComments = () => {
    if (
      this.state.ticket !== '' &&
      this.state.ticket.SupportComments.length !== 0
    ) {
      return this.state.ticket.SupportComments.map((comment, index) => {
        {
          {
            return renderIf(
              comment.isPostedByAdmin,
              <TouchableWithoutFeedback
                key={comment.supportCommentId}
                onPress={() => this.renderTime()}>
                <View
                  key={comment.supportCommentId}
                  style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <View styles={{flexDirection: 'column'}}>
                    <Text style={styles.adminComments}>
                      {comment.description}
                    </Text>
                    {renderIf(
                      this.state.showTime,
                      <Text>{`${comment.createdAt.substring(5,10)},${comment.createdAt.substring(11,16)}`}</Text>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>,
              <TouchableWithoutFeedback
                key={comment.supportCommentId}
                onPress={() => this.renderTime()}>
                <View
                  key={comment.supportCommentId}
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <View styles={{flexDirection: 'column'}}>
                    <Text style={styles.myComments}>{comment.description}</Text>
                    {renderIf(
                      this.state.showTime,
                      <Text>{`${comment.createdAt.substring(5,10)},${comment.createdAt.substring(11,16)}`}</Text>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          }
        }
      });
    } else {
      return (
        <View style={styles.nocomments}>
          <Image
            source={require('../img/NoSupportComment.png')}
            style={styles.imageContainer}
          />
          <Text style={styles.nocommentnotification}>
            No comments at the moment
          </Text>
        </View>
      );
    }
  };

  renderTime = () => {
    const timeVisible = this.state.showTime;
    this.setState({
      showTime: !timeVisible,
    });
  };

  async addComment(newComment) {
    try {
      if(this.state.newComment === ''){
        throw `Please enter an input in the chat box`
      }
      
      const response = await axios.post(
        `${globalVariable.supportCommentApi}create-comment`,
        {
          description: newComment,
          isPostedByAdmin: false,
          adminId: null,
          supportTicketId: this.state.ticket.supportTicketId,
        }
      );
      const comment = response.data;
      await this.getSupportTicket(this.state.ticket.supportTicketId);
      this.setState({
        newComment: null,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async closeTicket() {
    try {
      const response = await axios.put(
        `${globalVariable.supportTicketApi}resolve/${this.state.ticket.supportTicketId}`
      );
      const ticket = response.data;
      await ticket.SupportComments.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      this.setState({
        ticket: ticket,
      });
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
          backgroundColor="transparent"
        />
        <Text style={styles.header} category="h4">
          Support Ticket Details
        </Text>
        <ScrollView>
          <View style={styles.moreinfobox}>
            <Card style={styles.card}>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Ticket ID</Text>
                <Text>{this.state.ticket.supportTicketId}</Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Title</Text>
                <Text>{this.state.ticket.title}</Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Description</Text>
                <Text>{this.state.ticket.description}</Text>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between'}}>
                <Text style={styles.moreinfotext}>Type</Text>
                <View style={styles.status}>
                  <Text style={styles.statusword}>
                    {this.state.ticket.supportType}
                  </Text>
                </View>
                <Text style={styles.moreinfotext}>Status</Text>
                <View style={styles.status}>
                  <Text style={styles.statusword}>
                    {this.state.ticket.supportStatus}
                  </Text>
                </View>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Time</Text>
                <Text>{this.state.ticket.createdAt}</Text>
              </View>
              {renderIf(
                this.state.ticket.supportStatus === 'PENDING',
                <Button
                  style={styles.button}
                  onPress={() => this.closeTicket()}>
                  CLOSE TICKET
                </Button>
              )}
            </Card>
          </View>
          <Text style={styles.header} category="h4">
            Chat
          </Text>
          <View style={{flex: 1}}>{this.renderComments()}</View>
          {renderIf(
            this.state.ticket.supportStatus === 'PENDING',
            <View>
              <Input
                style={styles.input}
                placeholder="Add comment"
                multiline={true}
                textStyle={{minHeight: 64, textAlignVertical: 'top'}}
                value={this.state.newComment}
                onChangeText={(text) => this.setState({newComment: text})}
              />
              <Button
                style={styles.button}
                onPress={() => this.addComment(this.state.newComment)}>
                SEND
              </Button>
            </View>,
            <View>
              <Text style={styles.closenotification}>
                ---Ticket is closed!---
              </Text>
            </View>
          )}
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    fontFamily: 'Karla-Bold',
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  card: {
    borderRadius: 15,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  description: {
    fontSize: 14,
    color: '#888888',
  },
  status: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingRight: 10,
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  statusword: {
    color: '#3366ff',
    marginBottom: 5,
    marginTop: 5,
    fontWeight: 'bold',
  },
  moreinfobox: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  moreinfosubbox: {
    marginBottom: 20,
  },
  moreinfotext: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
  },
  input: {
    marginLeft: 15,
    marginRight: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  myComments: {
    backgroundColor: '#3366FF',
    color: 'white',
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    maxWidth: 300,
    marginBottom: 15,
    textAlign: 'right',
    marginLeft: 15,
    marginRight: 15,
  },
  adminComments: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    maxWidth: 300,
    marginBottom: 15,
    textAlign: 'left',
    marginLeft: 15,
    marginRight: 15,
  },
  closenotification: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  nocomments: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  nocommentnotification: {
    marginBottom: 20,
    color: 'grey',
    flexWrap: 'wrap',
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(SupportTicketDetails);
