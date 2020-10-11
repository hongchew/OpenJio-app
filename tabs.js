import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation, BottomNavigationTab, Icon, Button} from '@ui-kitten/components';

import ProfileScreen from './accessControlModule/ProfileScreen';
import HomeScreen from './accessControlModule/HomeScreen';
import LeaderboardScreen from './profileManagement/LeaderboardScreen';
import PaymentScreen from './paymentManagement/PaymentScreen';

const Tab = createBottomTabNavigator();

const PersonIcon = (props) => <Icon {...props} name="person" />;
const HomeIcon = (props) => <Icon {...props} name="home" />;
const LeaderIcon = (props) => <Icon {...props} name="bar-chart-2" />;
const PaymentIcon = (props) => <Icon {...props} name="credit-card-outline" />;

const AddButton = () => {
  return null
}

const BottomTabBar = ({navigation, state}) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
    //appearance="noIndicator"  
  >
    <BottomNavigationTab title="Home" icon={HomeIcon}/>
    <BottomNavigationTab title="Leaderboard" icon={LeaderIcon}/>
    <BottomNavigationTab title="Payment" icon={PaymentIcon}/>
    <BottomNavigationTab title="Profile" icon={PersonIcon}/>
  </BottomNavigation>
);

export const TabNavigator = () => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Leaderboard" component={LeaderboardScreen}/>
    <Tab.Screen name="Payment" component={PaymentScreen}/>
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator; 
