import {type} from '../actions';

const initialState = {
  loading: false,
  user: {
    Addresses: [],
    Wallet: {},
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case type.SET_USER:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case type.LOGOUT:
      return {
        ...state,
        loading: false,
        user: {
          Addresses: [],
        },
      };
    case type.UPDATE_ADDRESS_ARR:
      return {
        ...state,
        user: {
          ...state.user,
          Addresses: action.payload,
        },
      };
    case type.SET_WALLET:
      return {
        ...state,
        user: {
          ...state.user,
          Wallet: action.payload,
        },
      };
    default:
      return state;
  }
}
