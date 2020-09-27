import {combineReducers} from 'redux';

const initialState = {
  email: '',
  password: '',
  isLoggedIn: false,
};  

const accessReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN': 
      return {
        ...state, 
        email: action.email,
        password: action.password,
        isLoggedIn: true
      };
    case 'LOGOUT': 
      return {
        ...state, 
        email: '',
        password: '',
        isLoggedIn: false
      }
    default:
      return state;
  }
};

export default combineReducers({
  accessReducer
});
