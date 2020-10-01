import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, StyleSheet} from 'react-native';
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
          Home
        </Text>
        <Layout style={styles.container}>
          <Card style={styles.card}>
            <Text>
              The Maldives, officially the Republic of Maldives, is a small
              country in South Asia, located in the Arabian Sea of the Indian
              Ocean. It lies southwest of Sri Lanka and India, about 1,000
              kilometres (620 mi) from the Asian continent
            </Text>
          </Card>
        </Layout>
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
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: 'transparent',
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
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
    borderRadius:15,
    padding:5,
    elevation:4,
    shadowColor: '#ededed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10, 
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(HomeScreen);
