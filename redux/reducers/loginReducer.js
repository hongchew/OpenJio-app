import {type} from '../actions';

const initialState = {
  loading: false,
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case type.REQUEST_LOGIN:
      return {
        ...state,
        loading: true,
      };
    case type.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.loginDetails,
        error: null,
      };
    case type.LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case type.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
