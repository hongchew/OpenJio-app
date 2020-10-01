import { createStore, applyMiddleware, combineReducers } from 'redux';
import loginReducer from './reducers/loginReducer';
//import editProfileReducer from './reducers/editProfileReducer';
import thunk from 'redux-thunk';

// const rootReducer = combineReducers({
//     loginReducer,
//     editProfileReducer
// })
export default createStore(loginReducer, applyMiddleware(thunk)); 