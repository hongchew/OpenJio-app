import React from 'react';
import {connect} from 'react-redux';
import {View, StatusBar, Alert, StyleSheet, RefreshControl} from 'react-native';
import {Text, Layout, Button, Card} from '@ui-kitten/components';
import renderIf from '../components/renderIf';
import {ScrollView} from 'react-native-gesture-handler';
import {setUser, updateWallet} from '../redux/actions';
import axios from 'axios';
import loginStyle from '../styles/loginStyle';
import {globalVariable} from '../GLOBAL_VARIABLE';

class MonthlyDonationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      status: undefined,
      refreshing: false,
    };
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });

    axios
      .get(
        `${globalVariable.paypalApi}refresh-subscription/${this.props.user.userId}/${this.props.agreement.paypalSubscriptionId}`
      )
      .then((resp) => {
        this.setState({
          refreshing: false,
        });
        this.props.setUser(resp.data);
      })
      .catch((e) => {
        this.setState({
          refreshing: false,
        });
        console.log(e);
      });
  };

  async handleCancelTopUp() {
    try {
      this.setState({
        status: 'primary',
        message: 'Cancelling...',
      });
      const response = await axios.delete(
        globalVariable.paypalApi +
          `recurrent-agreement/${this.props.agreement.recurrentAgreementId}`
      );
      console.log(response.data);
      this.props.setUser(response.data);
      this.setState({
        status: 'success',
        message: '',
      });
    } catch (error) {
      this.setState({
        status: 'danger',
        message: 'An error had occurred.',
      });
      console.log(error);
    }
  }

  async handleEdit() {
    this.props.navigation.navigate('EditMonthlyDonationScreen');
  }

  renderButtons() {
    if (this.props.agreement) {
      return (
        <View>
          <Button
            style={styles.button}
            onPress={() => {
              this.handleEdit();
            }}>
            Edit Monthly Donation Amount
          </Button>
          <Button
            appearance="outline"
            style={styles.button}
            onPress={() => {
              this.handleCancelTopUp();
            }}>
            Cancel Monthly Donation
          </Button>
          <Text style={loginStyle.message}>
            Please wait a moment and pull down to refresh{'\n'} if "Next
            Payment" is not yet updated.
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Button
            style={styles.button}
            onPress={() =>
              this.props.navigation.navigate('SetMonthlyDonationScreen')
            }>
            Set Monthly Donation
          </Button>
        </View>
      );
    }
  }

  render() {
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
            backgroundColor="#ffffff"
            translucent={true}
          />
          <View style={styles.headerRow}>
            <Text style={styles.header} category="h4">
              Monthly Donation
            </Text>
          </View>
          <ScrollView style={styles.container}>
            <View style={styles.descriptionText}>
              <Text>OpenJio is a non-profit platform that depends on your donations to function.{`\n`}</Text>
              <Text>Set up an automatic monthly donation to help us make this platform possible!</Text>
            </View>
            {renderIf(
              this.props.agreement,
              <Card style={styles.card}>
                <Text style={styles.label}>Monthly Donation Amount</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{marginTop: 5}}>SGD</Text>
                  <Text style={styles.money}>
                    {this.props.agreement
                      ? this.props.agreement.amount.toFixed(2)
                      : null}
                  </Text>
                </View>
                <Text style={styles.label}>{'\n'}Paypal Subscription ID:</Text>
                <Text>
                  {this.props.agreement
                    ? this.props.agreement.paypalSubscriptionId
                    : null}
                </Text>
                <Text style={styles.label}>{'\n'}Next donation:</Text>
                <Text>
                  {this.props.agreement
                    ? new Date(
                        this.props.agreement.nextPaymentDate
                      ).toDateString()
                    : null}
                </Text>
                <Text style={styles.label}>{'\n'}Created on:</Text>
                <Text>
                  {this.props.agreement
                    ? new Date(this.props.agreement.createdAt).toDateString()
                    : null}
                </Text>
              </Card>
            )}
            {renderIf(
              !this.props.agreement,
              <Card style={styles.card}>
                <Text>No monthly donation set up yet</Text>
              </Card>
            )}
            {this.renderButtons()}

            <Text style={loginStyle.message} status={this.state.status}>
              {this.state.message}
            </Text>
          </ScrollView>
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 30,
    fontFamily: 'Karla-Bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: -10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 4,
    padding: -2,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    //marginTop: 30,
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  buttons: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  descriptionText: {
    textAlign: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  money: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  label: {
    color: '#3366FF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

const mapStateToProps = (state) => {
  //   console.log(state);
  const agreement = state.user.Wallet.RecurrentAgreements.filter(
    (agreement) => agreement.recurrentAgreementType === 'DONATE'
  )[0];
  return {
    user: state.user,
    agreement: agreement,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateWallet: (wallet) => {
      dispatch(updateWallet(wallet));
    },
    setUser: (user) => {
      dispatch(setUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyDonationScreen);
