import React from 'react'
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TopTabNavigator from './TopTabNavigator';
import Alerts from './screens/Alerts';
import Messages from './screens/Messages';
import theme from './styles/theme.style.js';


const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {


  return (
    <Tab.Navigator
      initialRouteName='Schedule'
      barStyle={{ backgroundColor: theme.CARD_BACKGROUND }}
    >
      <Tab.Screen
        name="Schedule"
        component={TopTabNavigator}
        options={{
          tabBarLabel: "Schedule",
          tabBarIcon: () => (
            <MaterialCommunityIcons name="calendar" color={theme.ICON_COLORS} size={26} />
          )
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={Alerts}
        options={{
          tabBarLabel: "Alerts",
          tabBarIcon: () => (
            <MaterialCommunityIcons name="bell" color={theme.ICON_COLORS} size={26} />
          )
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: () => (
            <MaterialCommunityIcons name="message" color={theme.ICON_COLORS} size={26} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabNavigator
