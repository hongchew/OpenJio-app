import React from 'react';
import {connect} from 'react-redux';
import renderIf from '../components/renderIf';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  Text,
  Layout,
  Card,
  Divider,
  List,
  ListItem,
  Button,
  Modal,
} from '@ui-kitten/components';
import {globalVariable} from '../GLOBAL_VARIABLE';
import axios from 'axios';

class RequestsUnderAnnoucements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: this.props.route.params.requests,
      allBtnStatus: 'primary',
      pendingBtnStatus: 'basic',
      acceptedBtnStatus: 'basic',
      modalVisible: false,
      selectedRequest: '',
    };
  }

  renderModal = () => {
    return (
      <Modal backdropStyle={styles.backdrop} visible={this.state.modalVisible}>
        <Card style={{marginLeft: 20, marginRight: 20}}>
          <Text style={{marginTop: 10, marginBottom: 10}}>
            {renderIf(
              this.state.acceptBtnClicked,
              'Are you sure you want to accept this request? This request will be scheduled after you accept.',
              'Are you sure you want to reject this request?'
            )}
          </Text>
          <ListItem
            description={
              <Text style={styles.label}>
                {this.state.selectedRequest.title}
              </Text>
            }
            title={<Text>Title</Text>}
          />
          <Divider />
          <ListItem
            description={
              <Text style={styles.label}>
                {this.state.selectedRequest.description
                  ? this.state.selectedRequest.description
                  : '-'}
              </Text>
            }
            title={<Text>Description</Text>}
          />
          <Divider />
          <ListItem
            description={
              <Text
                style={[styles.label, {fontWeight: 'bold', color: 'black'}]}>
                {'SGD $' +
                  parseFloat(this.state.selectedRequest.amount).toFixed(2)}
              </Text>
            }
            title={<Text>Amount</Text>}
          />
          <Layout style={styles.modalButtonsContainer}>
            <Button
              style={styles.modalButton}
              size={'small'}
              onPress={() => {
                this.setState({
                  modalVisible: false,
                });
                this.handleRequest();
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
  };

  renderList = () => {
    let data;
    if (this.state.allBtnStatus === 'primary') {
      data = this.state.requests;
    } else if (this.state.pendingBtnStatus === 'primary') {
      data = this.state.requests.filter(
        (request) => request.requestStatus === 'PENDING'
      );
    } else if (this.state.acceptedBtnStatus === 'primary') {
      data = this.state.requests.filter(
        (request) => request.requestStatus !== 'PENDING'
      );
    }
    const renderItem = ({item}) => {
      return (
        <ListItem
          style={styles.listItem}
          title={<Text>{item.title}</Text>}
          description={
            <Text style={styles.description}>
              {(item.description ? item.description : '-') +
                '\nSGD $' +
                parseFloat(item.amount).toFixed(2)}
            </Text>
          }
          accessoryRight={() => {
            return renderIf(
              item.requestStatus === 'PENDING',
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({modalVisible: true, selectedRequest: item});
                  }}>
                  <Image
                    source={require('../img/check.png')}
                    style={styles.imageContainer}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({modalVisible: true, selectedRequest: item});
                  }}>
                  <Image
                    source={require('../img/cross.png')}
                    style={styles.imageContainer}
                  />
                </TouchableOpacity>
              </View>,
              <Text style={styles.requestStatus}>{item.requestStatus}</Text>
            );
          }}
          onPress={() =>
            this.props.navigation.navigate('RequestDetails', {
              requestId: item.requestId,
            })
          }
        />
      );
    };
    return (
      <List
        style={styles.listContainer}
        data={data}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      />
    );
  };

  render() {
    return (
      <Layout style={styles.layout}>
        <Text style={styles.header} category="h4">
          Requests Under Jio
        </Text>
        <View style={styles.buttonGrp}>
          <Button
            status={this.state.allBtnStatus}
            style={styles.buttonItem}
            onPress={this.viewAll}
            onPress={() => {
              this.setState({
                allBtnStatus: 'primary',
                pendingBtnStatus: 'basic',
                acceptedBtnStatus: 'basic',
              });
            }}>
            All
          </Button>
          <Button
            status={this.state.pendingBtnStatus}
            style={styles.buttonItem}
            onPress={() => {
              this.setState({
                allBtnStatus: 'basic',
                pendingBtnStatus: 'primary',
                acceptedBtnStatus: 'basic',
              });
            }}>
            Pending
          </Button>
          <Button
            status={this.state.acceptedBtnStatus}
            style={styles.buttonItem}
            onPress={() => {
              this.setState({
                allBtnStatus: 'basic',
                pendingBtnStatus: 'basic',
                acceptedBtnStatus: 'primary',
              });
            }}>
            Accepted
          </Button>
        </View>
        <View style={styles.list}>{this.renderList()}</View>
        {this.renderModal()}
      </Layout>
    );
  }
}
const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  header: {
    marginLeft: 15,
    fontFamily: 'Karla-Bold',
  },
  buttonGrp: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
  },
  buttonItem: {
    width: 110,
  },
  list: {
    marginBottom: 30,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#888888',
  },
  listItem: {
    marginLeft: 10,
    marginRight: 10,
  },
  listContainer: {
    backgroundColor: 'white',
  },
  requestStatus: {
    fontStyle: 'italic',
    textTransform: 'capitalize',
  },
  imageContainer: {
    width: 25,
    height: 25,
    marginLeft: 20,
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

export default connect(mapStateToProps)(RequestsUnderAnnoucements);
