import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, StyleSheet, ScrollView} from 'react-native';
import {Text, Layout, Card} from '@ui-kitten/components';
import {logout} from '../redux/actions';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
    };
    //console.log(this.props.user);
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
          Announcements
        </Text>
        <ScrollView style={styles.container}>
          <Card style={styles.card}>
            
            <Text category="label" style={styles.label}>
              Description
            </Text>
            <Text style={styles.word}>
              Heading out to buy koi at jurong point, anyone wants anything from koi? 
              {'\n'}
            </Text>
            <Text category="label" style={styles.label}>
              Start Location
            </Text>
            <Text style={styles.word}>
              Jurong Point 
              {'\n'}
            </Text>
            <Text category="label" style={styles.label}>
              Destination
            </Text>
            <Text style={styles.word}>
              Jurong Point 
              {'\n'}
            </Text>
            <Text category="label" style={styles.label}>
              Close Time
            </Text>
            <Text style={styles.word}>
              5pm
              {'\n'}
            </Text>
            <Text category="label" style={styles.label}>
              Status
            </Text>
            <Text style={styles.word}>
              Active
              {'\n'}
            </Text>
            
          </Card>

          <Card style={styles.card}>
            
            <Text category="label" style={styles.label}>
              Description
            </Text>
            <Text style={styles.word}>
              Heading out to buy koi at jurong point, anyone wants anything from koi? 
              {'\n'}
            </Text>
            <Text category="label" style={styles.label}>
              Start Location
            </Text>
            <Text style={styles.word}>
              Jurong Point 
              {'\n'}
            </Text>
            <Text category="label" style={styles.label}>
              Destination
            </Text>
            <Text style={styles.word}>
              Jurong Point 
              {'\n'}
            </Text>
            <Text category="label" style={styles.label}>
              Close Time
            </Text>
            <Text style={styles.word}>
              5pm
              {'\n'}
            </Text>
            <Text category="label" style={styles.label}>
              Status
            </Text>
            <Text style={styles.word}>
              Active
              {'\n'}
            </Text>
            
          </Card>
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
    backgroundColor: 'transparent',
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  menu: {
    flex: 1,
    backgroundColor: 'white',
  },
  menuItem: {
    fontSize: 16,
  },
  card: {
    backgroundColor:"white",
    marginLeft: 20, 
    marginRight: 20,
    marginBottom: 20,
    marginTop: 10,
    borderRadius:15,
    elevation:4,
    shadowColor: '#ededed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10, 
  },
  label: {
    marginTop: 5,
    marginBottom: 8,
    color: 'grey'
  },
  word: {
    fontSize: 16,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(HomeScreen);
