import React from 'react';
import {Avatar} from '@ui-kitten/components';

export const globalVariable = {
  apiUrl: 'http://10.0.2.2:3000/users/',
  addressApi: 'http://10.0.2.2:3000/addresses/',
};

export const DefaultAvatar = () => (
  <Avatar source={require('./img/defaultAvatar.png')} shape='rounded' size='giant' />
);