import React from 'react';
import {SafeAreaView} from 'react-native';
import {Button, Icon} from '@ui-kitten/components';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
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
import UserBadges from './profileManagement/UserBadges';
import LeaderboardScreen from './profileManagement/LeaderboardScreen';
import TopUpScreen from './paymentManagement/TopUp';
import PaymentScreen from './paymentManagement/MakePayment';
//import TransactionsListScreen from './paymentManagement/TransactionsListScreen';
import PaymentSettingsScreen from './paymentManagement/PaymentSettingsScreen';

import TabNavigator from './tabs';
import WalletLimit from './paymentManagement/WalletLimit';
import AddWalletLimit from './paymentManagement/AddWalletLimit';
import EditWalletLimit from './paymentManagement/EditWalletLimit';

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
    mode="modal">
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
              // navigation.replace('Tabs', {screen: 'Profile'});
              navigation.goBack();
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
      name="WalletLimit"
      component={WalletLimit}
      options={({navigation}) => ({
        title: 'Wallet Limit',
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}
    />
    <Stack.Screen
      name="AddWalletLimit"
      component={AddWalletLimit}
      options={({navigation}) => ({
        title: 'Add Wallet Limit',
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}
    />
    <Stack.Screen
      name="EditWalletLimit"
      component={EditWalletLimit}
      options={({navigation}) => ({
        title: 'Edit Wallet Limit',
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
    <Stack.Screen
      name="UserBadges"
      component={UserBadges}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: () => (
          <Button
            onPress={() => {
              // navigation.replace('Tabs', {screen: 'Profile'});
              navigation.goBack();
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
      name="LeaderboardScreen"
      component={LeaderboardScreen}
      options={({navigation}) => ({
        title: 'Leaderboard',
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
    <Stack.Screen
      name="TopUp"
      component={TopUpScreen}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="MakePayment"
      component={PaymentScreen}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    {/* <Stack.Screen
      name="TransactionsList"
      component={TransactionsListScreen}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    /> */}
    <Stack.Screen
      name="PaymentSettings"
      component={PaymentSettingsScreen}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Tabs', {screen: 'Wallet'});
            }}
            accessoryLeft={BackIcon}
            appearance="ghost"
            status="basic"
            size="tiny"
          />
        ),
      })}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
