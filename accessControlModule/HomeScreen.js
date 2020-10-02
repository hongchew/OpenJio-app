import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, StyleSheet, ScrollView} from 'react-native';
import {Text, Layout, Card} from '@ui-kitten/components';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //populate state.user because after logging out, this.props.user will cause error
      user: this.props.user,
    };
    console.log(this.props);
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
              Destination
            </Text>
            <Text style={{fontWeight: 'bold'}} category="h5">
              Jurong Point
            </Text>

            <Text category="label" style={styles.label}>
              Description
            </Text>
            <Text style={styles.word}>
              Heading out to buy koi at jurong point, anyone wants anything from
              koi?
            </Text>

            <Text category="label" style={styles.label}>
              Close Time
            </Text>
            <Text style={styles.word}>
              5pm
            </Text>

            <Text category="label" style={styles.label}>
              Submitted by 
            </Text>
            <Text style={styles.word}>
              Terry Lim
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="label" style={styles.label}>
              Destination
            </Text>
            <Text style={{fontWeight: 'bold', marginBottom: 8}} category="h5">
              Blk 2 Mama Shop
            </Text>

            <Text category="label" style={styles.label}>
              Description
            </Text>
            <Text style={styles.word}>
              Heading out to get some groceries at the mama shop at blk 2, anyone wants me to help them buy anything?
            </Text>

            <Text category="label" style={styles.label}>
              Close Time
            </Text>
            <Text style={styles.word}>
              5pm
            </Text>
            <Text category="label" style={styles.label}>
              Submitted by 
            </Text>
            <Text style={styles.word}>
              Darren Low
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
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#ededed',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  label: {
    marginTop: 10,
    color: 'grey',
  },
  word: {
    marginTop: 10,
    marginBottom: 8,
    lineHeight: 22,
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(HomeScreen);
