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
  CheckBox,
  Modal,
  Input,
} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import {setUser} from '../redux/actions';

class DeclareCovid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
      postalCode: '',
      declareCovid: this.props.route.params
        ? this.props.route.params.declareCovid
        : null,
      //yes = 0, no = 1
      hasCovid: false, //false means not checked
      hasNoCovid: false, //false means not checked
      modalVisible: false,
    };
    console.log(this.props.route.params);
  }

  handleSubmit() {
    //got covid 
    console.log(this.state.hasCovid);
    if (this.state.declareCovid) {
      if (!this.state.hasCovid) {
        this.setState({
          message: 'Checkbox cannot be empty.',
        });
      } else if (this.state.postalCode === '') {
        this.setState({
          message: 'Postal Code cannot be empty.',
        });
      } else {
        this.setState({
          modalVisible: true,
        });
      }
    } else {
      if (!this.state.hasNoCovid) {
        console.log('coming hre');
        this.setState({
          message: 'Checkbox cannot be empty.',
        });
      } else {
        this.setState({
          modalVisible: true,
        });
      }
    }

  }

  async handleDeclareCovid() {
    let hasCovid;
    if (this.state.hasCovid) {
      hasCovid = true;
    } else if (this.state.hasNoCovid) {
      hasCovid = false; 
    }
    
    try {
      if (hasCovid) {
          const response = await axios.post(
            globalVariable.outbreakZoneApi + 'create-outbreakzone',
            {
              postalCode: this.state.postalCode,
            }
          );
      }
      const userResponse = await axios.put(
        globalVariable.userApi + 'update-user-details',
        {
          userId: this.state.user.userId,
          hasCovid: hasCovid,
        }
      );

      this.props.setUser(userResponse.data);
      this.props.navigation.replace('Tabs', {screen: 'Home'})
    } catch (error) {
      this.setState({
        message: 'Failed.',
      });
    }
  }

  renderModal() {
    return (
      <Modal backdropStyle={styles.backdrop} visible={this.state.modalVisible}>
        <Card style={{marginLeft: 20, marginRight: 20}}>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            {this.state.hasCovid && 'Are you sure you are diagnosed with COVID-19? Do stay at home and take good care of yourself.'}
            {this.state.hasNoCovid && 'Are you sure you have recovered from COVID-19? Still remember to take care of yourself and practise social distancing!'}
          </Text>
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  modalVisible: false,
                });
                this.handleDeclareCovid();
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
        <Text style={styles.header} category="h4">
          {this.state.declareCovid
            ? 'Declare COVID-19'
            : 'Declare Free from COVID'}
        </Text>
        <Text style={styles.subtitle}>
          {this.state.declareCovid
            ? `For COVID-19 prevention purpose, it is necessary to declare that you have COVID-19!`
            : 'Declare that you have recovered so you can start making announcements!'}
        </Text>
        <ScrollView style={styles.container}>
          {renderIf(
            this.state.declareCovid,
            <Card style={styles.card}>
              <CheckBox
                checked={this.state.hasCovid}
                onChange={(nextChecked) => this.setState({hasCovid: nextChecked})}>
                  <Text style={{fontSize: 15}}>I have been diagnosed with COVID-19</Text>
              </CheckBox>
            </Card>,
            <Card style={styles.card}>
            <CheckBox
              checked={this.state.hasNoCovid}
              onChange={(nextChecked) => this.setState({hasNoCovid: nextChecked})}>
                <Text style={{fontSize: 15}}>I have recovered from COVID-19</Text>
            </CheckBox>
          </Card>
          )}
          
          {this.state.declareCovid && (
            <View style={{marginLeft: 20, marginRight: 20}}>
              <Input
                label="Postal Code"
                value={this.state.postalCode}
                onChangeText={(text) => this.setState({postalCode: text})}
              />
              <Text
                style={{fontStyle: 'italic', color: 'grey', marginBottom: 10}}>
                Please enter the postal code of your area of residence when you
                were diagnosed with COVID-19.
              </Text>
            </View>
          )}

          
          <Button style={styles.button} onPress={() => this.handleSubmit()}>
          Next
        </Button>
        <Text style={styles.description} status="danger">
            {this.state.message}
          </Text>
        </ScrollView>
        
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

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeclareCovid);
