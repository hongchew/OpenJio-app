import React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Text, Layout, Input, Button, IndexPath, Select, SelectItem} from '@ui-kitten/components';
import {connect} from 'react-redux';
import loginStyle from '../styles/loginStyle';
import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';
import renderIf from '../components/renderIf';

class AddSupportTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.user.userId,
      title: null,
      description: null,
      supportType: null,
      message: null,
      ticket: null,
      supportTypeOptions: ['PROFILE','SYSTEM','PAYMENT','JIO','REQUEST','HEALTH'],
      selectedIndex: new IndexPath(0),
      displayValue: 'Select a support type',
    };
  }

  async addSupportTicket() {
    if (
      this.state.title === null ||
      this.state.description === null ||
      this.state.supportType === null
    ) {
      this.setState({
        message: 'Please fill in all the fields',
      });
    } else {
      try {
        const response = await axios.post(
          `${globalVariable.supportTicketApi}create-ticket`,
          {
            title: this.state.title,
            description: this.state.description,
            supportType: this.state.supportType,
            userId: this.props.user.userId,
          }
        );
        const ticket = response.data;
        console.log(ticket);
        this.setState({
          ticket: ticket,
        });
        this.props.navigation.navigate('SupportTickets');
      } catch (error) {
        console.log(error);
      }
    }
  }

  renderOption = (title,index) => (
    <SelectItem title={title} key={index}/>
  );

  render() {
    return (
      <Layout style={styles.layout}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#ffffff"
          translucent={true}
        />
        <Text style={styles.header} category="h4">
          New Support Ticket
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <Layout style={styles.container}>
              <Input
                style={styles.input}
                label="Title"
                value={this.state.title}
                onChangeText={(text) => this.setState({title: text})}
              />
              <Input
                style={styles.input}
                label="Description"
                multiline={true}
                textStyle={{minHeight: 64, textAlignVertical: 'top'}}
                value={this.state.description}
                onChangeText={(text) => this.setState({description: text})}
              />
              <Select
                placeholder="Default"
                value={this.state.displayValue}
                selectedIndex={this.state.selectedIndex}
                onSelect={(index) => {
                  this.setState(
                    {selectedIndex: index},
                    this.setState({
                      displayValue: this.state.supportTypeOptions[index - 1],
                      supportType: this.state.supportTypeOptions[index - 1]
                    })
                  );
                }}>
                {this.state.supportTypeOptions.map(this.renderOption)}
              </Select>
              <Button
                style={styles.button}
                onPress={() => this.addSupportTicket()}>
                CREATE SUPPORT TICKET
              </Button>
              {
                renderIf(
                  this.state.message !== null,
                  <Text style={styles.message}>{this.state.message}</Text>
                )
              }
            </Layout>
          </ScrollView>
        </TouchableWithoutFeedback>
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
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  button: {
    marginTop: 30,
  },
  input: {
    marginBottom: 20
  },
  message:{
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: 'red'
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(AddSupportTicket);
