import React from 'react';
import {Button, Icon} from '@ui-kitten/components';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
} from '@react-navigation/stack';
//screens from access control module 
import LoginScreen from './accessControlModule/LoginScreen';
import ProfileScreen from './accessControlModule/ProfileScreen';
import SignupScreen from './accessControlModule/SignupScreen';
import ChangePassword from './accessControlModule/ChangePassword';
import ForgotPassword from './accessControlModule/ForgotPassword';
import HomeScreen from './accessControlModule/HomeScreen';
//screens from profile management 
import EditProfile from './profileManagement/EditProfile';
import AddressScreen from './profileManagement/AddressScreen';
import AddAddress from './profileManagement/AddAddress';
import VerifyAccount from './profileManagement/VerifyAccount';
import UserBadges from './profileManagement/UserBadges';
import LeaderboardScreen from './profileManagement/LeaderboardScreen';
//screens from payment management 
import WalletScreen from './paymentManagement/WalletScreen';
import MakePayment from './paymentManagement/MakePayment';
import TopUpScreen from './paymentManagement/TopUpScreen';
import TransactionsListScreen from './paymentManagement/TransactionsListScreen';
import PaymentSettingsScreen from './paymentManagement/PaymentSettingsScreen';
import WalletLimit from './paymentManagement/WalletLimit';
import AddWalletLimit from './paymentManagement/AddWalletLimit';
import EditWalletLimit from './paymentManagement/EditWalletLimit';
import Donate from './paymentManagement/Donate';
import Withdraw from './paymentManagement/Withdraw';
import SuccessfulScreen from './paymentManagement/SuccessfulScreen';
//tab navigator 
import TabNavigator from './tabs';


const Stack = createStackNavigator();

const BackIcon = (props) => (
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
    <Stack.Screen name="Wallet" component={WalletScreen} />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
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
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="AddWalletLimit"
      component={AddWalletLimit}
      options={({navigation}) => ({
        title: 'Add Wallet Limit',
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="EditWalletLimit"
      component={EditWalletLimit}
      options={({navigation}) => ({
        title: 'Edit Wallet Limit',
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="AddAddress"
      component={AddAddress}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
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
      name="UserBadges"
      component={UserBadges}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
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
      name="LeaderboardScreen"
      component={LeaderboardScreen}
      options={({navigation}) => ({
        title: 'Leaderboard',
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="TopUpScreen"
      component={TopUpScreen}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
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
    <Stack.Screen name="Tabs" component={TabNavigator} />
    <Stack.Screen
      name="TopUp"
      component={TopUpScreen}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
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
    <Stack.Screen
      name="Donate"
      component={Donate}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="Withdraw"
      component={Withdraw}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="MakePayment"
      component={MakePayment}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
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
    <Stack.Screen
      name="TransactionsList"
      component={TransactionsListScreen}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="PaymentSettings"
      component={PaymentSettingsScreen}
      options={({navigation}) => ({
        headerShown: true,
        gestureEnabled: true,
        ...TransitionPresets.FadeFromBottomAndroid,
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
    {/* doesn't include any buttons because i just want a page that shows successful payment */}
    {/* and have a button to navigate back to the wallet screen */}
    <Stack.Screen
      name="SuccessfulScreen"
      component={SuccessfulScreen}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
