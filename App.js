import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Sudoku from './src/Sudoku';
import Leaderboard from './src/Leaderboard';

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator shifting = {true}>
      <Tab.Screen
        name="Sudoku"
        component={Sudoku}
        options={{
          tabBarLabel: 'Sudoku',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="controller-classic" color={color} size={26} />
          ),
          tabBarColor: "#1abfdf",
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={Leaderboard}
        options={{
          tabBarLabel: 'Ranglista',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="format-list-numbered" color={color} size={26} />
          ),
          tabBarColor: "#fbae4b",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}