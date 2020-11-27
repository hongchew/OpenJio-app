import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, TextInput, View, StyleSheet, ScrollView} from 'react-native';
import {
  Text,
  Layout,
  Button,
  Card,
  RadioGroup,
  Radio,
  Modal,
} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class HealthDeclaration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      temp: '',
      hasSymptoms: 0,
      shnNotice: 0,
      announcementId: this.props.route.params
        ? this.props.route.params.announcementId
        : null,
      startJio: this.props.route.params
        ? this.props.route.params.startJio
        : null,
      message: '',
      temperatureLog: '',
    };
    console.log(this.props.route.params);
  }

  safeParseFloat = (str) => {
    const value = Number.parseFloat(str);
    return Number.isNaN(value) ? 0 : value;
  };

  async handleSubmit() {
    let hasSymptoms;
    let shnNotice;
    if (
      this.state.temp === 0 ||
      this.state.temp === -1 ||
      this.state.temp < 35
    ) {
      this.setState({
        message: 'Invalid temperature.',
      });
    } else {
      //user answered yes (has symptoms)
      if (this.state.hasSymptoms === 0) {
        hasSymptoms = true;
      } else {
        hasSymptoms = false;
      }

      if (this.state.shnNotice === 0) {
        shnNotice = true;
      } else {
        shnNotice = false;
      }

      try {
        const response = await axios.post(
          globalVariable.temperatureApi + 'create-log',
          {
            userId: this.state.user.userId,
            temperature: this.state.temp,
            hasSymptoms: hasSymptoms,
            stayHomeNotice: shnNotice,
          }
        );
        this.setState({
          user: response.data,
          message: '',
        });

        //check if user is able to proceed to make announcement/request or not
        //by checking if the user has symptoms/on shn
        //if symptoms/on shn === false, meaning can proceed
        if (!this.state.user.hasSymptoms && !this.state.user.onSHN) {
          //coming from home page (make announcement)
          if (this.state.startJio) {
            this.props.navigation.navigate('MakeAnnouncement');
          } else if (this.state.announcementId) {
            //params passed over from AnnouncementDetails page to make request
            this.props.navigation.navigate('MakeRequest', {
              announcementId: this.state.announcementId,
            });
          }
        } else {
          this.setState({
            modalVisible: true,
          });
        }
      } catch (error) {
        this.setState({
          message: 'Failed.',
        });
      }
    }
  }

  renderModal() {
    return (
      <Modal backdropStyle={styles.backdrop} visible={this.state.modalVisible}>
        <Card style={{marginLeft: 20, marginRight: 20}}>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            {renderIf(
              this.state.startJio,
              'It seems like you are unwell or on stay home notice, you should stay home and try making requests instead. ',
              'It seems like you are unwell or on stay home notice, this information will be relayed to the announcer.'
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
                  renderIf(
                    this.state.startJio &&
                      !this.state.user.hasSymptoms &&
                      !this.state.user.onSHN,
                    this.props.navigation.navigate('MakeAnnouncement'),
                    this.props.navigation.replace('Tabs', {screen: 'Home'})
                  );
                }
                {
                  this.state.announcementId &&
                    this.props.navigation.navigate('MakeRequest', {
                      announcementId: this.state.announcementId,
                    });
                }
              }}>
              {renderIf(
                this.state.startJio &&
                  (this.state.user.hasSymptoms || this.state.user.onSHN),
                'Back to Home',
                'Confirm'
              )}
            </Button>
            {renderIf(
              this.state.startJio &&
                (!this.state.user.hasSymptoms && !this.state.user.onSHN),
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
            )}
          </Layout>
        </Card>
      </Modal>
    );
  }

  //Update state whenever data passed between screens is changed, so that the user will not be redirected to the wrong screen
  componentDidUpdate(prevProps) {
    if (this.props.route.params != prevProps.route.params) {
      this.setState({
        announcementId: this.props.route.params.announcementId,
      });
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
          Health Declaration
        </Text>
        <Text style={styles.subtitle}>
          For covid-19 prevention purpose, it is necessary to declare that you
          are fit!
        </Text>
        <ScrollView style={styles.container}>
          <Card style={styles.card}>
            <Text style={styles.tempLabel}>Temperature</Text>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                keyboardType={'number-pad'}
                style={styles.temp}
                value={this.state.temp}
                onChangeText={(temp) =>
                  this.setState({temp: this.safeParseFloat(temp)})
                }
              />
              <Text
                style={{
                  marginTop: 10,
                  marginRight: 5,
                  fontSize: 24,
                  fontWeight: 'bold',
                }}>
                °C
              </Text>
            </View>
          </Card>
          <Card style={styles.card}>
            <Text style={{marginTop: 8, marginBottom: 10}}>
              Do you have any flu-like symptoms (e.g. fever, coughing or
              breathing difficulties)?
            </Text>
            <RadioGroup
              selectedIndex={this.state.hasSymptoms}
              onChange={(index) => this.setState({hasSymptoms: index})}>
              {/* if yes is selected, value = 0 */}
              <Radio>Yes</Radio>
              {/* if no is selected, value = 1 */}
              <Radio>No</Radio>
            </RadioGroup>
          </Card>
          <Card style={styles.card}>
            <Text style={{marginTop: 8, marginBottom: 10}}>
              Are you on Stay-Home-Notice?
            </Text>
            <RadioGroup
              selectedIndex={this.state.shnNotice}
              onChange={(index) => this.setState({shnNotice: index})}>
              {/* if yes is selected, value = 0 */}
              <Radio>Yes</Radio>
              {/* if no is selected, value = 1 */}
              <Radio>No</Radio>
            </RadioGroup>
          </Card>

          <Text style={styles.description} status="danger">
            {this.state.message}
          </Text>
        </ScrollView>
        <Button style={styles.button} onPress={() => this.handleSubmit()}>
          Next
        </Button>
        {this.renderModal()}
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
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#ededed',
    //shadowOffset: {width: 0, height: 2},
    //shadowOpacity: 0.2,
    //shadowRadius: 10,
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
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
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

export default connect(mapStateToProps)(HealthDeclaration);
