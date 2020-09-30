import axios from 'axios';
import {globalVariable} from '../GLOBAL_VARIABLE';

export const type = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  REQUEST_LOGIN: 'REQUEST_LOGIN',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
};

export function requestLogin() {
  return {
    type: type.REQUEST_LOGIN,
  };
}

export function loginSuccess(loginDetails) {
  return {
    type: type.LOGIN_SUCCESS,
    payload: {
      loginDetails,
    },
  };
}

export function loginFailed(error) {
  return {
    type: type.LOGIN_FAILED,
    payload: error,
  };
}

export function logout() {
  return {
    type: type.LOGOUT,
  };
}

//Thunk action creator
export function login({email, password}) {
  return function (dispatch, getState) {
    dispatch(requestLogin());
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
        dispatch(loginFailed(error.message));
      });
  };
}
