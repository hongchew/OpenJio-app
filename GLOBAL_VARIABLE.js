import React from 'react';
import {Avatar} from '@ui-kitten/components';

const serverUrl = 'http://10.0.2.2:3000';

export const globalVariable = {
  userApi: `${serverUrl}/users/`,
  addressApi: `${serverUrl}/addresses/`,
};

export const DefaultAvatar = () => (
  <Avatar source={require('./img/defaultAvatar.png')} shape='rounded' size='giant' />
);