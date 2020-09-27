import axios from 'axios';

const apiUrl = 'http://10.0.2.2:3000/users/login';

export const login = ({email, password}) => async dispatch => {
  console.log(email, password);
    return axios.post(apiUrl, {
      email: email, 
      password: password
    })
    .then((response) => {
      dispatch(loginSuccess(response.data))
    })
    .catch(error => {
      console.log('Failed to login: ' + error)
    });
  
};

export const loginSuccess = (data) => {
  return {
    type: 'LOGIN',
    email: data.email,
    password: data.password
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};
