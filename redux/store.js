import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import accessReducer from './reducers/AccessReducer';

const store = createStore(accessReducer, applyMiddleware(thunk));

export default store; 