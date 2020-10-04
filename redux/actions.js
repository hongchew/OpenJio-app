export const type = {
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  UPDATE_ADDRESS_ARR: 'UPDATE_ADDRESS_ARR',
  DELETE_ADDRESS: 'DELETE_ADDRESS',
};

//getting the user after api is called
//and set it the redux state
export function setUser(user) {
  console.log('coming into action');
  console.log('what is useracc: ' + user);
  return {
    type: type.SET_USER,
    payload: user,
  };
}

export function logout() {
  return {
    type: type.LOGOUT,
  };
}

//for addresses management
//the details here is the array of addresses
//that we want to put in the state
export function updateAddressArr(details) {
  return {
    type: type.UPDATE_ADDRESS_ARR,
    payload: details,
  };
}
