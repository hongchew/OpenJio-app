import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

export const type = {
  REQUEST_ACTION: 'REQUEST_ACTION',
  REQUEST_FAILED: 'REQUEST_FAILED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  EDIT_SUCCESS: 'EDIT_SUCCESS',
  ADD_ADDRESS_SUCCESS: 'ADD_ADDRESS_SUCCESS',
  DELETE_ADDRESS_SUCCESS: 'DELETE_ADDRESS_SUCCESS',
};

//general request and request failed
export function requestAction() {
  return {
    type: type.REQUEST_ACTION,
  };
}

export function requestFailed(error) {
  return {
    type: type.REQUEST_FAILED,
    payload: {
      error,
    },
  };
}
//end of general requests

//access controls
export function loginSuccess(userAccount) {
  return {
    type: type.LOGIN_SUCCESS,
    payload: {
      userAccount,
    },
  };
}

export function logout() {
  return {
    type: type.LOGOUT,
  };
}

//thunk action creator for login
export function login({email, password}) {
  return function (dispatch, getState) {
    dispatch(requestAction());
    //console.log('Current state: ' + getState());
    axios
      .post(globalVariable.apiUrl + 'login', {
        email,
        password,
      })
      .then((response) => {
        dispatch(loginSuccess(response.data));
      })
      .catch((error) => {
        dispatch(requestFailed(error.message));
      });
  };
}
//end of access controls

//for profile management
export function editSuccess(editDetails) {
  return {
    type: type.EDIT_SUCCESS,
    payload: {
      editDetails,
    },
  };
}

//Thunk action creator for editProfile
export function editProfile(user) {
  console.log(user);
  return function (dispatch, getState) {
    dispatch(requestAction());
    //console.log('Current state: ' + getState());
    axios
      .put(globalVariable.apiUrl + 'update-user-details', user)
      .then((response) => {
        dispatch(editSuccess(response.data));
      })
      .catch((error) => {
        dispatch(requestFailed(error.message));
      });
  };
}

//end of profile management

//for addresses management
export function addAddressSuccess(details) {
  return {
    type: type.ADD_ADDRESS_SUCCESS,
    payload: {details},
  };
}

//Thunk action creator for addAddress
export function addAddress(userId, address) {
  return function (dispatch, getState) {
    dispatch(requestAction());
    //console.log('Current state: ' + getState());

    axios
      .post(globalVariable.addressApi + 'add', {userId, address})
      .then((response) => {
        console.log('COMING HERE ACTION addAddress ' + response.data);
        dispatch(addAddressSuccess(response.data));
      })
      .catch((error) => {
        dispatch(requestFailed(error.message));
      });
  };
}

export function deleteAddressSuccess(details) {
  return {
    type: type.DELETE_ADDRESS_SUCCESS,
    payload: {details},
  };
}

export function deleteAddress(addressId) {
  return function (dispatch, getState) {
    dispatch(requestAction());
    //console.log('Current state: ' + getState());
    console.log(addressId);
    // const body = {
    //   addressId: addressId
    // }
    // console.log(body);
    axios
      .delete(globalVariable.addressApi + addressId)
      .then((response) => { 
        dispatch(deleteAddressSuccess(response.data));
      })
      .catch((error) => {
        console.log(error);
        dispatch(requestFailed(error.message));
      });
  };
}
