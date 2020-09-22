import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';


const Stack = createStackNavigator();

const HomeNavigator = () => (
    <Stack.Navigator
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen
            name="Home"
            component={HomeScreen}
        />
    </Stack.Navigator>
);

export const AppNavigator = () => (
    <NavigationContainer>
        <HomeNavigator />
    </NavigationContainer>
);