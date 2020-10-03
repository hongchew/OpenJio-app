import {type} from '../actions';

const initialState = {
  loading: false,
  user: {
    Addresses: [],
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case type.SET_USER:
      console.log(action.payload);
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
      console.log(action.payload);
      return {
        ...state,
        user: {
          ...state.user,
          Addresses: action.payload,
        },
      };
    default:
      return state;
  }
}
