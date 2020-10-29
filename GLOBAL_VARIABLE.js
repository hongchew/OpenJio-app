import React from 'react';
import {Avatar} from '@ui-kitten/components';

const serverUrl = 'http://10.0.2.2:3000';

export const globalVariable = {
  serverUrl,
  userApi: `${serverUrl}/users/`,
  addressApi: `${serverUrl}/addresses/`,
  paypalApi: `${serverUrl}/paypal/`,
  walletApi: `${serverUrl}/wallets/`,
  transactionApi: `${serverUrl}/transactions/`,
  temperatureApi: `${serverUrl}/temperatures/`
};

export const UserAvatar = (props) => {
  return (
    <Avatar
      source={
        props.source
          ? {uri: `${serverUrl}${props.source.slice(1)}`}
          : require('./img/defaultAvatar.png')
      }
      shape="round"
      size={props.size}
    />
  );
};
