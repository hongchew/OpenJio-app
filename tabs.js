import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation, BottomNavigationTab, Icon, Button} from '@ui-kitten/components';

import ProfileScreen from './accessControlModule/ProfileScreen';
import HomeScreen from './accessControlModule/HomeScreen';
import AddressScreen from './profileManagement/AddressScreen';

const Tab = createBottomTabNavigator();

const PersonIcon = (props) => <Icon {...props} name="person" />;
const HomeIcon = (props) => <Icon {...props} name="home" />;
const AddIcon = (props) => <Icon {...props} name="plus" />;

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
    <BottomNavigationTab icon={AddIcon}/>
    <BottomNavigationTab title="Profile" icon={PersonIcon}/>
  </BottomNavigation>
);

const TabNavigator = () => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen 
      name="Add" 
      component={AddButton}
      options={{
        tabBarIcon: <Button status='danger' accessoryLeft={AddIcon} onPress={() => this.props.navigation.replace('Address')}/>
      }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
