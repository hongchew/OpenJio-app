import React from 'react';
import {connect} from 'react-redux';
import {StatusBar, Image, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Layout, Card} from '@ui-kitten/components';
import {UserAvatar} from '../GLOBAL_VARIABLE';

class HomeScreen extends React.Component {
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
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="transparent"
          translucent={true}
        />
        
        <ScrollView style={styles.container}>
        <Text style={styles.header} category="h4">
          Hey, {this.state.user.name}
        </Text>
        <Text style={styles.subtitle}>
          Start reducing footprints by making announcements and requests.
        </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('HealthDeclaration')}>
            <Image
              style={{
                width: 400,
                height: 120,
                alignSelf: 'center',
              }}
              source={require('../img/homeImg.png')}
            />
          </TouchableOpacity>
          <Text style={styles.subheader} category="h6">
            Announcements
          </Text>
          <Card style={styles.card}>
            <Text category="label" style={styles.label}>
              Destination
            </Text>
            <Text style={{fontWeight: 'bold'}} category="h6">
              Jurong Point
            </Text>

            <Text category="label" style={styles.label}>
              Description
            </Text>
            <Text style={styles.word}>
              Heading out to buy koi at jurong point, anyone wants anything from
              koi?
            </Text>

            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View>
                <Text category="label" style={styles.label}>
                  Submitted by
                </Text>
                <View style={styles.userRow}>
                  <UserAvatar
                    source={this.props.user ? this.props.user.avatarPath : null}
                    size="small"
                  />
                  <Text style={styles.name}>Terry Lim</Text>
                </View>
              </View>
              <View style={{marginLeft: 40}}>
                <Text category="label" style={styles.label}>
                  Close Time
                </Text>
                <Text style={styles.word}>5pm</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.card}>
            <Text category="label" style={styles.label}>
              Destination
            </Text>
            <Text style={{fontWeight: 'bold'}} category="h6">
              Jurong Point
            </Text>

            <Text category="label" style={styles.label}>
              Description
            </Text>
            <Text style={styles.word}>
              Heading out to buy koi at jurong point, anyone wants anything from
              koi?
            </Text>

            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View>
                <Text category="label" style={styles.label}>
                  Submitted by
                </Text>
                <View style={styles.userRow}>
                  <UserAvatar
                    source={this.props.user ? this.props.user.avatarPath : null}
                    size="small"
                  />
                  <Text style={styles.name}>Terry Lim</Text>
                </View>
              </View>
              <View style={{marginLeft: 40}}>
                <Text category="label" style={styles.label}>
                  Close Time
                </Text>
                <Text style={styles.word}>5pm</Text>
              </View>
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
  },
  container: {
    flex: 1,
  },
  header: {
    marginTop: 70,
    marginBottom: 10,
    marginLeft: 20,
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
    alignItems: 'center'
  },
  name: {
    marginLeft: 10,
  },
  card: {
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 8,
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
    justifyContent: 'center'
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(HomeScreen);
