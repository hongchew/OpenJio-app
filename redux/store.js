import { createStore, applyMiddleware } from 'redux';
import loginReducer from './reducers/loginReducer';
import thunk from 'redux-thunk';

export default createStore(loginReducer, applyMiddleware(thunk)); 