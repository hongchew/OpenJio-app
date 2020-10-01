import {type} from '../actions';

const initialState = {
  loading: false,
};

export default function editProfileReducer(state = initialState, action) {
  switch (action.type) {
    case type.REQUEST_EDIT:
      return {
        ...state,
        loading: true,
      };
    case type.EDIT_SUCCESS:
      console.log('coming here');
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case type.EDIT_FAILED:
        console.log('failed');
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
