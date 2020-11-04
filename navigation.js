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
import SetMonthlyTopUpScreen from './paymentManagement/SetMonthlyTopUpScreen';
import EditMonthlyTopUpScreen from './paymentManagement/EditMonthlyTopUpScreen';
import MonthlyTopUpScreen from './paymentManagement/MonthlyTopUpScreen';
import TransactionsListScreen from './paymentManagement/TransactionsListScreen';
import TransactionDetailsScreen from './paymentManagement/TransactionDetailsScreen';
import PaymentSettingsScreen from './paymentManagement/PaymentSettingsScreen';
import WalletLimit from './paymentManagement/WalletLimit';
import AddWalletLimit from './paymentManagement/AddWalletLimit';
import EditWalletLimit from './paymentManagement/EditWalletLimit';
import Donate from './paymentManagement/Donate';
import Withdraw from './paymentManagement/Withdraw';
import SuccessfulScreen from './paymentManagement/SuccessfulScreen';
<<<<<<< HEAD
//tab navigator
import TabNavigator from './tabs';
import MyAnnouncement from './JioManagement/MyAnnouncement';
=======
//screens from jio management
import MakeRequest from './jioManagement/MakeRequest';
import StartLocation from './jioManagement/StartLocation';
import AnnouncementDetails from './jioManagement/AnnouncementDetails';
import HealthDeclaration from './jioManagement/HealthDeclaration';
import MakeAnnouncement from './jioManagement/MakeAnnouncement';
import MyActivity from './jioManagement/MyActivity';
import MyHistory from './jioManagement/MyHistory';
//tab navigator
import TabNavigator from './tabs';
>>>>>>> 81ee61f15b1aeb6c09f8b2d1d29f8d6b694a3e58

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
    <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
    <Stack.Screen name="MyActivity" component={MyActivity} />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={({navigation}) => ({
        headerShown: true,
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
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="WalletLimit"
      component={WalletLimit}
      options={({navigation}) => ({
        title: 'Wallet Limit',
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="AddWalletLimit"
      component={AddWalletLimit}
      options={({navigation}) => ({
        title: 'Add Wallet Limit',
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="EditWalletLimit"
      component={EditWalletLimit}
      options={({navigation}) => ({
        title: 'Edit Wallet Limit',
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="AddAddress"
      component={AddAddress}
      options={({navigation}) => ({
        headerShown: true,
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
      name="TopUpScreen"
      component={TopUpScreen}
      options={({navigation}) => ({
        headerShown: true,
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
      name="Withdraw"
      component={Withdraw}
      options={({navigation}) => ({
        headerShown: true,
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
      name="MakePayment"
      component={MakePayment}
      options={({navigation}) => ({
        headerShown: true,
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
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="TransactionDetails"
      component={TransactionDetailsScreen}
      options={({navigation}) => ({
        //applied header style to this screen because of the grey top layout
        headerStyle: {backgroundColor: '#F5F5F5', elevation: 0},
        headerTitleStyle: {color: '#F5F5F5'},
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="PaymentSettings"
      component={PaymentSettingsScreen}
      options={({navigation}) => ({
        headerShown: true,
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
      name="HealthDeclaration"
      component={HealthDeclaration}
      options={({navigation}) => ({
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Tabs', {screen: 'Home'});
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
      name="MakeAnnouncement"
      component={MakeAnnouncement}
      options={({navigation}) => ({
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    {/* doesn't include any buttons because i just want a page that shows successful payment */}
    {/* and have a button to navigate back to the wallet screen */}
    <Stack.Screen name="SuccessfulScreen" component={SuccessfulScreen} />
    <Stack.Screen name="MyAnnouncement" component={MyAnnouncement} />
    <Stack.Screen
      name="SetMonthlyTopUpScreen"
      component={SetMonthlyTopUpScreen}
      options={({navigation}) => ({
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="MonthlyTopUpScreen"
      component={MonthlyTopUpScreen}
      options={({navigation}) => ({
        title: 'Monthly Top Up',
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="EditMonthlyTopUpScreen"
      component={EditMonthlyTopUpScreen}
      options={({navigation}) => ({
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    />
    <Stack.Screen
      name="MakeRequest"
      component={MakeRequest}
      options={({navigation}) => ({
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
        headerLeft: () => (
          <Button
            onPress={() => {
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
      name="StartLocation"
      component={StartLocation}
      options={({navigation}) => ({
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Tabs', {screen: 'Home'});
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
      name="AnnouncementDetails"
      component={AnnouncementDetails}
      options={({navigation}) => ({
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Tabs', {screen: 'Home'});
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
      name="MyHistory"
      component={MyHistory}
      options={({navigation}) => ({
        headerShown: true,
        ...TransitionPresets.FadeFromBottomAndroid,
        headerLeft: () => (
          <Button
            onPress={() => {
              navigation.replace('Tabs', {screen: 'MyActivity'});
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
