import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  StatusBar,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Text, Layout, Card} from '@ui-kitten/components';

//to make sure the status bar change to certain colour only on this page
function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
    };
  }

  render() {
    return (
      <Layout style={styles.layout}>
        <FocusAwareStatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
          //translucent={true}
        />
        <Text style={styles.header} category="h4">
          Wallet
        </Text>
        <ScrollView style={styles.container}>
          <Card style={styles.card}>
            <Text style={styles.label}>Balance</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginTop: 5}}>SGD </Text>
              <Text style={styles.money}>3.00</Text>
            </View>
          </Card>

          <Card>
            <Text style={styles.action}>Quick Actions</Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('TopUpScreen')}
                style={styles.buttonItem}>
                <Image
                  source={require('../img/topUp.png')}
                  style={styles.imageContainer}
                />
                <Text style={styles.subtitle}>Top-Up</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.buttonItem}>
                <Image
                  source={require('../img/sendMoney.png')}
                  style={styles.imageContainer}
                />
                <Text style={styles.subtitle}>Send</Text>
              </TouchableOpacity>
            </View>
          </Card>
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
  container: {
    flex: 2,
    //backgroundColor: 'white',
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  card: {
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  actionContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  label: {
    color: '#3366FF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  action: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  money: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 16,
    marginTop: 10,
    paddingBottom: 30,
    textAlign: 'center',
  },
  buttonItem: {
    paddingTop: 20,
    marginLeft: 20,
    marginRight: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(PaymentScreen);
