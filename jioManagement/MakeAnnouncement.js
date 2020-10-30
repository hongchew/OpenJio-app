import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, View, StyleSheet, ScrollView} from 'react-native';
import {
  Text,
  Layout,
  Button,
  Card,
  Input,
  Modal,
} from '@ui-kitten/components';
import DatePicker from 'react-native-date-picker';

class MakeAnnouncement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      temp: 0,
      closeTime: new Date(),
      isVisible: false,
      timeStr: '',
      dateStr: '',
      destination: '', 
      description: '',
      selected: false, 
      btnString: 'Set close time',
    };
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

  handleCloseTime = (selectedDate) => {
    this.setState({
      chosenDate: selectedDate,
      datePicked: true,
    });
  };

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
      string = "Close Time: " + formattedDate + ', ' + formattedTime;
    } else {
      chosenDate = this.state.closeTime; 
      formattedDate = this.formatDate(this.state.closeTime); 
      formattedTime = this.formatTime(this.state.closeTime); 
      string = "Close Time: " + formattedDate + ', ' + formattedTime;
    }
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
      console.log('coming here');
      this.props.navigation.navigate('StartLocation', {
        destination: this.state.destination, 
        description: this.state.description, 
        closeTime: JSON.stringify(this.state.closeTime)
      })
    }
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
        <Text style={styles.header} category="h4">
          Make Announcement
        </Text>
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
                date={this.state.closeTime}
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
                    this.setState({isVisible: false, closeTime: this.state.closeTime});
                  }}>
                  Dismiss
                </Button>
              </View>
            </Card>
          </Modal>
        </ScrollView>
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
