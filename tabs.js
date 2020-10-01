import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation, BottomNavigationTab, Icon} from '@ui-kitten/components';

import ProfileScreen from './accessControlModule/ProfileScreen';
import HomeScreen from './accessControlModule/HomeScreen';

const Tab = createBottomTabNavigator();

const PersonIcon = (props) => <Icon {...props} name="person" />;
const HomeIcon = (props) => <Icon {...props} name="home" />;



const BottomTabBar = ({navigation, state}) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
    //appearance="noIndicator"  
  >
    <BottomNavigationTab title="Home" icon={HomeIcon}/>
    <BottomNavigationTab title="Profile" icon={PersonIcon}/>
  </BottomNavigation>
);

const TabNavigator = () => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
