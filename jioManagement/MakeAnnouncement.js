import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, View, StyleSheet, ScrollView} from 'react-native';
import {Text, Layout, Button, Card, Input, Modal} from '@ui-kitten/components';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import renderIf from '../components/renderIf';

class MakeAnnouncement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      temp: 0,
      closeTime: new Date(),
      chosenDate: new Date(),
      isVisible: false,
      timeStr: '',
      dateStr: '',
      destination: '',
      description: '',
      selected: false,
      btnString: 'Set close time',
      deleteModalVisible: false,
    };
  }

  componentDidMount() {
    console.log(this.props.route.params);
    if (this.props.route.params) {
      this.retrieveAnnouncement();
    }
  }

  async retrieveAnnouncement() {
    try {
      const response = await axios.get(
        `${globalVariable.announcementApi}by/${this.props.route.params.announcementId}`
      );
      const announcement = response.data;
      const formattedDate = this.formatDate(new Date(announcement.closeTime));
      const formattedTime = this.formatTime(new Date(announcement.closeTime));
      const string = 'Close Time: ' + formattedDate + ', ' + formattedTime;

      this.setState({
        destination: announcement.destination,
        description: announcement.description,
        selected: true,
        closeTime: new Date(announcement.closeTime),
        btnString: string,
      });
    } catch (error) {
      console.log(error);
    }
  }

  safeParseFloat = (str) => {
    const value = Number.parseFloat(str);
    return Number.isNaN(value) ? 0 : value;
  };

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

  async rejectRequest(requestId) {
    console.log(requestId);
    try {
      const rejectedRequest = await axios.put(
        `${globalVariable.requestApi}reject-request`,
        {requestId: requestId}
      );
    } catch (error) {
      console.log(error);
      this.setState({
        message: 'Unable to reject pending requests.',
      });
    }
  }

  async handleDeleteAnnouncement() {
    try {
      const requestsUnderThisAnnouncement = await axios.get(
        `${globalVariable.announcementApi}all-requests/${this.props.route.params.announcementId}`
      );

      const requests = requestsUnderThisAnnouncement.data;
      const pending = requests.filter(
        (request) => request.requestStatus === 'PENDING'
      );

      await Promise.all(
        pending.map(async (request) => {
          this.rejectRequest(request.requestId);
        })
      );

      const response = await axios.delete(
        `${globalVariable.announcementApi}by/${this.props.route.params.announcementId}`
      );

      this.props.navigation.replace('Tabs', {screen: 'MyActivity'});
    } catch (e) {
      console.log(e);
      this.setState({
        message: 'Unable to delete your announcement.',
      });
    }
  }

  //handle when user scroll the datepicker
  handleCloseTime = (selectedDate) => {
    this.setState({
      chosenDate: selectedDate,
      datePicked: true,
    });
  };

  //when user clicks on the "Confirm button on the modal box"
  handleConfirm() {
    var string;
    var formattedDate;
    var formattedTime;
    var chosenDate;

    //if the user scroll the datepicker
    if (this.state.datePicked) {
      chosenDate = this.state.chosenDate;
      formattedDate = this.formatDate(chosenDate);
      formattedTime = this.formatTime(chosenDate);
    } else {
      chosenDate = this.state.closeTime;
      formattedDate = this.formatDate(this.state.closeTime);
      formattedTime = this.formatTime(this.state.closeTime);
    }
    string = 'Close Time: ' + formattedDate + ', ' + formattedTime;
    this.setState({
      isVisible: false,
      closeTime: chosenDate,
      btnString: string,
      selected: true, //user has set a time
      datePicked: false, //reset the date picker state
    });
  }

  handleSubmit = () => {
    if (!this.state.selected) {
      this.setState({
        message: 'Please set a close time.',
      });
    } else if (this.state.destination === '' || this.state.description === '') {
      this.setState({
        message: 'Destination and description fields cannot be empty.',
      });
    } else {
      if (this.props.route.params) {
        //if its edit
        this.props.navigation.navigate('StartLocation', {
          destination: this.state.destination,
          description: this.state.description,
          closeTime: JSON.stringify(this.state.closeTime),
          announcementId: this.props.route.params.announcementId,
        });
      } else {
        //if its create
        this.props.navigation.navigate('StartLocation', {
          destination: this.state.destination,
          description: this.state.description,
          closeTime: JSON.stringify(this.state.closeTime),
        });
      }
    }
  };

  renderDeleteModal() {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        visible={this.state.deleteModalVisible}>
        <Card>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            Are you sure you want to delete this jio?
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({deleteModalVisible: false});
                this.handleDeleteAnnouncement();
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

  render() {
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setHours(maxDate.getHours() + 24);
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
          translucent={true}
        />
        {renderIf(
          this.props.route.params,
          <View style={styles.headerRow}>
            <Text style={styles.header} category="h4">
              Edit Jio
            </Text>
            <Button
              style={styles.deleteButton}
              status="basic"
              onPress={() => this.setState({deleteModalVisible: true})}>
              Delete Jio
            </Button>
          </View>,
          <Text style={styles.header} category="h4">
            Start a Jio
          </Text>
        )}

        <ScrollView style={styles.container}>
          <Input
            label="Destination"
            multiline={true}
            textStyle={{minHeight: 40, textAlignVertical: 'top'}}
            value={this.state.destination}
            onChangeText={(text) => this.setState({destination: text})}
            style={{marginBottom: 15}}
          />
          <Input
            label="Description"
            multiline={true}
            textStyle={{minHeight: 64, textAlignVertical: 'top'}}
            value={this.state.description}
            onChangeText={(text) => this.setState({description: text})}
          />
          <Button
            appearance="outline"
            style={{marginTop: 20}}
            onPress={() => this.setState({isVisible: true})}>
            {this.state.btnString}
          </Button>

          <Button style={styles.button} onPress={() => this.handleSubmit()}>
            Next
          </Button>

          <Text style={styles.description} status="danger">
            {this.state.message}
          </Text>

          <Modal backdropStyle={styles.backdrop} visible={this.state.isVisible}>
            <Card>
              <DatePicker
                //date time now
                minimumDate={minDate}
                //tomorrow
                maximumDate={maxDate}
                timeZoneOffsetInMinutes="480"
                date={this.state.chosenDate}
                onDateChange={this.handleCloseTime}
              />

              <View style={styles.modalButtonsContainer}>
                <Button
                  style={styles.modalButton}
                  size={'small'}
                  onPress={() => this.handleConfirm()}>
                  Confirm
                </Button>
                <Button
                  appearance={'outline'}
                  style={styles.modalButton}
                  size={'small'}
                  onPress={() => {
                    this.setState({
                      isVisible: false,
                      closeTime: this.state.closeTime,
                    });
                  }}>
                  Dismiss
                </Button>
              </View>
            </Card>
          </Modal>
        </ScrollView>
        {this.renderDeleteModal()}
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
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  subheader: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    fontFamily: 'Karla-Bold',
  },
  subtitle: {
    //marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    color: 'grey',
    flexWrap: 'wrap',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginLeft: 10,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#ededed',
    //shadowOffset: {width: 0, height: 2},
    //shadowOpacity: 0.2,
    //shadowRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  deleteButton: {
    marginTop: 20,
    height: 10,
  },
  modalButtonsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    marginTop: 20,
    width: 120,
    margin: 5,
  },
  label: {
    marginTop: 10,
    color: 'grey',
  },
  word: {
    marginTop: 10,
    marginBottom: 8,
    lineHeight: 22,
    justifyContent: 'center',
  },
  tempLabel: {
    color: '#3366FF',
    fontSize: 14,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  temp: {
    width: 80,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#3366FF',
  },
  amountInput: {
    marginBottom: 5,
    flex: 1,
    borderColor: '#3366FF',
    borderBottomWidth: 1.0,
  },
  button: {
    marginTop: 30,
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MakeAnnouncement);
