import React from 'react';
import {Button, Icon} from '@ui-kitten/components';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets
} from '@react-navigation/stack';

import LoginScreen from './accessControlModule/LoginScreen';
import ProfileScreen from './accessControlModule/ProfileScreen';
import SignupScreen from './accessControlModule/SignupScreen';
import ChangePassword from './accessControlModule/ChangePassword';
import ForgotPassword from './accessControlModule/ForgotPassword';
import HomeScreen from './accessControlModule/HomeScreen';
import EditProfile from './profileManagement/EditProfile';
import AddressScreen from './profileManagement/AddressScreen';
import AddAddress from './profileManagement/AddAddress';
import VerifyAccount from './profileManagement/VerifyAccount';

import TabNavigator from './tabs';

const Stack = createStackNavigator();

const BackIcon = (props) => (
  <Icon {...props} name="close-outline" width="25" height="25" />
);

const Back = (props) => (
  <Icon {...props} name="arrow-back-outline" width="25" height="25" />
);

const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: {
        elevation: 0,
      },
      headerTitleStyle: {
        color: '#ffffff', //hide the ugly title
      },
    }}
    mode='modal'
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...TransitionPresets.FadeFromBottomAndroid,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Tabs', {screen: 'Profile'});
            }}
            accessoryLeft={BackIcon}
            appearance="ghost"
            status="basic"
            size="tiny"
          />
        ),
      })}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...TransitionPresets.FadeFromBottomAndroid,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Tabs', {screen: 'Profile'});
            }}
            accessoryLeft={BackIcon}
            appearance="ghost"
            status="basic"
            size="tiny"
          />
        ),
      })}
    />
    <Stack.Screen
      name="Address"
      component={AddressScreen}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...TransitionPresets.FadeFromBottomAndroid,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Tabs', {screen: 'Profile'});
            }}
            accessoryLeft={BackIcon}
            appearance="ghost"
            status="basic"
            size="tiny"
          />
        ),
      })}
    />
    <Stack.Screen
      name="AddAddress"
      component={AddAddress}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Address');
            }}
            accessoryLeft={BackIcon}
            appearance="ghost"
            status="basic"
            size="tiny"
          />
        ),
      })}
    />
    <Stack.Screen
      name="VerifyAccount"
      component={VerifyAccount}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Tabs', {screen: 'Profile'});
            }}
            accessoryLeft={BackIcon}
            appearance="ghost"
            status="basic"
            size="tiny"
          />
        ),
      })}
    />
    {/* <Stack.Screen
      name="AddAddress"
      component={AddAddress}
      options={{
        headerShown: true,
      }}
    /> */}
    <Stack.Screen name="Tabs" component={TabNavigator} />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
