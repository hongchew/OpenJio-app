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
} from '@ui-kitten/components';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

class HealthDeclaration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      temp: '',
      selectedIndex: 0,
      announcementId: this.props.route.params
        ? this.props.route.params.announcementId
        : null,
      startJio: this.props.route.params 
        ? this.props.route.params.startJio : null,
      message: '',
      temperatureLog: '',
    };
    console.log(this.props.route.params);
  }

  safeParseFloat = (str) => {
    const value = Number.parseFloat(str);
    return Number.isNaN(value) ? 0 : value;
  };

  async handleSubmitTemp() {
    let hasCovid;
    if (
      this.state.temp === 0 ||
      this.state.temp === -1 ||
      this.state.temp < 35
    ) {
      this.setState({
        message: 'Invalid temperature.',
      });
    } else {
      //user answered yes (has covid)
      if (this.state.selectedIndex === 0) {
        hasCovid = true;
      } else {
        hasCovid = false;
      }

      try {
        const response = await axios.post(
          globalVariable.temperatureApi + 'create-log',
          {
            userId: this.state.user.userId,
            temperature: this.state.temp,
            hasCovid: hasCovid,
          }
        );
        this.setState({
          temperatureLog: response.data,
          message: '',
        });


        //check if user is able to proceed to make announcement/request or not
        //by checking the risk level
        if (this.state.temperatureLog.riskLevel === 'LOW_RISK') {
          //coming from home page (make announcement)
          if (this.state.startJio) {
            this.props.navigation.replace('MakeAnnouncement');
          } else if (this.state.announcementId) {  
            //params passed over from AnnouncementDetails page to make request
            this.props.navigation.replace('MakeRequest', {
              announcementId: this.state.announcementId,
            });
          } else {
            this.props.navigation.replace('Tabs', {screen: 'Home'});
          }
        } else {
          this.setState({
            message:
              'Your risk level is high and you are not able to make any jios/requests.',
          });
        }
      } catch (error) {
        this.setState({
          message: 'Failed.',
        });
      }
    }
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
          For covid-19 prevention purpose, it is necessary to declare
          that you are fit!
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
              Do you have COVID-19 or any related symptoms (e.g. fever, coughing
              or breathing difficulties)?
            </Text>
            <RadioGroup
              selectedIndex={this.state.selectedIndex}
              onChange={(index) => this.setState({selectedIndex: index})}>
              {/* if yes is selected, value = 0 */}
              <Radio>Yes</Radio>
              {/* if no is selected, value = 1 */}
              <Radio>No</Radio>
            </RadioGroup>
          </Card>
          <Button style={styles.button} onPress={() => this.handleSubmitTemp()}>
            Next
          </Button>

          <Text style={styles.description} status="danger">
            {this.state.message}
          </Text>
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

export default connect(mapStateToProps)(HealthDeclaration);
