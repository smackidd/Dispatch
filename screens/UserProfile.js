import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import useAuth from '../hooks/useAuth';
import Profile from '../components/Profile';
import TaskTemplates from '../components/TaskTemplates';
import Header from '../components/Header';
import theme from '../styles/theme.style.js';



const Tab = createMaterialTopTabNavigator();


const UserProfile = () => {
  const { user } = useAuth();

  return (
    <>
      <View >
        <Header />
      </View>

      {user.role !== 'Freelancer' ? (
        <Tab.Navigator
          screenOptions={{
            swipeEnabled: false,
            tabBarLabelStyle: { color: theme.FONT_COLORS },
            tabBarStyle: {
              backgroundColor: theme.PRIMARY_BACKGROUND_200,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.55,
              shadowRadius: 1.1,
              elevation: 6,
            },
            tabBarIndicatorStyle: {
              borderBottomWidth: 4,
              borderColor: theme.ACCENT_COLOR
            }
          }}

        >
          <Tab.Screen name="Profile" children={() => <Profile />} />
          <Tab.Screen name="TaskTemplates" children={() => <TaskTemplates />} />

        </Tab.Navigator>
      ) : (
        <Profile />
      )}


    </>
  )
}

export default UserProfile