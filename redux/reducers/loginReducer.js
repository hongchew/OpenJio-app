import {type} from '../actions';

const initialState = {
  loading: false,
  isUpdated: false,
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case type.REQUEST_ACTION:
      return {
        ...state,
        loading: true,
      };
    case type.REQUEST_FAILED:
      console.log('failed');
      return {
        ...state,
        loading: false,
        isUpdated: false,
        error: action.payload.error,
      };
    case type.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.userAccount,
        error: null,
      };
    case type.LOGOUT:
      return {
        ...state,
        loading: false,
        user: null,
      };
    case type.EDIT_SUCCESS:
      return {
        ...state,
        isUpdated: true,
        user: action.payload.editDetails,
      };
    case type.ADD_ADDRESS_SUCCESS: 
    //console.log(...state.user);
      return {
        ...state,
        user: {
            ...state.user,
            Addresses: action.payload.details,
        },
        isUpdated: true,
      }
      case type.DELETE_ADDRESS_SUCCESS: 
      console.log('coming here');
    //console.log(...state.user);
      return {
        ...state,
        user: {
            ...state.user,
            Addresses: action.payload.details,
        },
        isUpdated: true,
      }
    default:
      return state;
  }
}
