import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from '@ui-kitten/components';

import LoginScreen from './accessControlModule/LoginScreen';
import ProfileScreen from './accessControlModule/ProfileScreen';
import SignupScreen from './accessControlModule/SignupScreen';
import ChangePassword from './accessControlModule/ChangePassword';
import ForgotPassword from './accessControlModule/ForgotPassword';


const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: {
        elevation: 0
      },
      headerTitleStyle: {
        color: '#ffffff'  //hide the ugly title 
      }
    }}>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
    />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
