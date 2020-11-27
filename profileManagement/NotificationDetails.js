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
import {
  Text,
  Layout,
  Divider,
  Card,
  Button,
  Modal,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {UserAvatar} from '../GLOBAL_VARIABLE';
import axios from 'axios';

class NotificationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: this.props.route.params.notification,
      deleteModalVisible: false,
    };
  }

  formatTime(date) {
    //convert to 12-hour clock
    var hours = date.getHours();
    var amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var formattedTime = hours + ':' + minutes + ' ' + amOrPm;
    return formattedTime;
  }

  formatDate(date) {
    var formattedDate =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    return formattedDate;
  }

  renderDeleteModal() {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={this.state.deleteModalVisible}>
        <Card style={{marginLeft: 15, marginRight: 15}}>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            Are you sure you want to delete this notification?
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({deleteModalVisible: false});
                this.handleDelete();
              }}>
              Confirm
            </Button>
            <Button
              appearance={'outline'}
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  deleteModalVisible: false,
                });
              }}>
              Dismiss
            </Button>
          </Layout>
        </Card>
      </Modal>
    );
  }

  async handleDelete() {
    await axios.delete(
      `${globalVariable.notificationApi}${this.state.notification.notificationId}`
    );
    this.props.navigation.replace('Notification');
  }

  render() {
    var cDate = new Date(this.state.notification.createdAt);
    var formattedDate = this.formatDate(cDate);
    var formattedTime = this.formatTime(cDate);
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <ScrollView>
          <View style={styles.headerRow}>
            <Text style={styles.header} category="h4">
              Notification Details
            </Text>
          </View>
          <Card style={styles.card}>
            <View style={styles.moreinfosubbox}>
              <Text style={styles.moreinfotext}>Title</Text>
              <Text style={{marginBottom: 20}}>
                {this.state.notification.title}
              </Text>
              <Text style={styles.moreinfotext}>Content</Text>
              <View style={styles.moreinfosubbox}>
                <Text style={{marginBottom: 20}}>
                  {this.state.notification.content}
                </Text>
              </View>
              <Text style={styles.label}>Received At</Text>
              <Text>{formattedDate + ', ' + formattedTime}</Text>
            </View>
          </Card>
          <Button
            status="basic"
            style={styles.button}
            onPress={() => {
              this.setState({deleteModalVisible: true});
            }}>
            Delete
          </Button>
          {this.renderDeleteModal()}
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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 10,
    fontFamily: 'Karla-Bold',
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
  moreinfosubbox: {
    marginBottom: 20,
  },
  moreinfotext: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
  },
  label: {
    marginTop: 5,
    color: 'grey',
  },
  button: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
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

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(NotificationDetails);
