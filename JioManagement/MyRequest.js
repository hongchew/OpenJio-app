import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Divider,
  MenuItem,
  Button,
  Icon,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';

const ForwardIcon = (props) => <Icon {...props} name="arrow-ios-forward" />;

class MyRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      request: {},
      requestedUser: {},
      announcement: {},
    };
  }

  componentDidMount() {
    const requestId = this.props.route.params.requestId;
    this.getRequest(requestId);
  }

  //obtain the full list of transactions, credit and debit transactions
  async getRequest(requestId) {
    try {
      const response = await axios.get(
        `${globalVariable.requestApi}by-requestId/${requestId}`
      );
      //   console.log(response.data);
      //set state of request
      this.setState({
        request: response.data,
      });
    } catch (error) {
      console.log(error);
    }
    console.log(this.state.request.announcementId);
    // try {
    //   const response = await axios.get(
    //     `${globalVariable.userApi}/${this.state.request.userId}`
    //   );
    //   console.log(response);
    //   this.setState({
    //     requestedUser: response.data,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      const response = await axios.get(
        `${globalVariable.announcementApi}by/${this.state.request.announcementId}`
      );
      console.log(response);
      this.setState({
        announcement: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    console.log(this.state.request.status);
    return (
      <Layout style={styles.layout}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor="transparent"
          />
          <Text style={styles.header} category="h4">
            My Request
          </Text>

          <View style={styles.moreinfobox}>
            <Card style={styles.card}>
              {/* <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Requester</Text>
                <Text>{this.state.requestedUser.name}</Text>
              </View> */}
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Title</Text>
                <Text>{this.state.request.title}</Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Description</Text>
                <Text>{this.state.request.description}</Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Price</Text>
                <Text>${this.state.request.amount}</Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>Request Time</Text>
                <Text>{new Date(this.state.request.createdAt).toString()}</Text>
              </View>
              <View style={styles.moreinfosubbox}>
                <Text style={styles.moreinfotext}>
                  Associated Announcement Description
                </Text>
                <Text>{this.state.announcement.description}</Text>
              </View>
              {renderIf(
                this.state.request.requestStatus === 'PENDING',

                <View style={styles.moreinfosubbox}>
                  <Text style={styles.moreinfotext}>Status</Text>
                  <Text>Pending</Text>
                </View>
              )}
              {renderIf(
                this.state.request.requestStatus === 'SCHEDULED',
                <View style={styles.moreinfosubbox}>
                  <Text style={styles.moreinfotext}>Status</Text>
                  <Text>Scheduled</Text>
                </View>
              )}
              {renderIf(
                this.state.request.requestStatus === 'REJECTED',
                <View style={styles.moreinfosubbox}>
                  <Text style={styles.moreinfotext}>Status</Text>
                  <Text>Rejected</Text>
                </View>
              )}
              {renderIf(
                this.state.request.requestStatus === 'DOING',
                <View style={styles.moreinfosubbox}>
                  <Text style={styles.moreinfotext}>Status</Text>
                  <Text>Doing</Text>
                </View>
              )}
              {renderIf(
                this.state.request.requestStatus === 'COMPLETED',
                <View style={styles.moreinfosubbox}>
                  <Text style={styles.moreinfotext}>Status</Text>
                  <Text>Completed</Text>
                </View>
              )}
              {renderIf(
                this.state.request.requestStatus === 'VERIFIED',
                <View style={styles.moreinfosubbox}>
                  <Text style={styles.moreinfotext}>Status</Text>
                  <Text>Verified</Text>
                </View>
              )}
            </Card>

            {renderIf(
              this.state.request.requestStatus === 'PENDING',
              <View style={styles.buttons}>
                <Button
                  style={styles.buttonItem}
                  onPress={() => this.handleEdit()}>
                  Edit
                </Button>
                <Button
                  style={styles.buttonItem}
                  onPress={() => this.handleDelete()}>
                  Delete
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginLeft: 15,
    backgroundColor: '#F5F5F5',
    fontFamily: 'Karla-Bold',
  },
  card: {
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 15,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  transactionList: {
    marginBottom: 30,
    flex: 1,
  },
  transactionTab: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  amount: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#888888',
  },
  money: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  amountlabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  UserTransactionType: {
    backgroundColor: '#3366FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
  },
  buttonItem: {
    paddingTop: 20,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    height: 10,
    width: 120,
    paddingBottom: 20,
  },
  TopUpTransactionType: {
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
  },
  WithdrawTransactionType: {
    backgroundColor: '#58d68d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
  },
  DonateTransactionType: {
    backgroundColor: '#FF8A80',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
  },
  moreinfobox: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  moreinfosubbox: {
    marginBottom: 20,
  },
  moreinfotext: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  body: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  report: {
    paddingLeft: 18,
    marginTop: 10,
    marginBottom: 30,
  },
  buttons: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    // marginTop: 20,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(MyRequest);
