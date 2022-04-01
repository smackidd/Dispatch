import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
//import React from 'react'
import { View, Text } from 'react-native'
import BottomTabNavigator from "./BottomTabNavigator";
import { db } from "./Firebase";
import useAuth from "./hooks/useAuth";
import AddContact from "./screens/AddContact";
import AddEvent from "./screens/AddEvent";
import Completed from "./screens/Completed";
import EventModal from "./screens/EventModal";
import InitAccountInfo from "./screens/InitAccountInfo";
import InProgress from "./screens/InProgress";
import LoginScreen from "./screens/LoginScreen";
import MessageScreen from "./screens/MessageScreen";
import Upcoming from "./screens/Upcoming";
import UpdateEvent from "./screens/UpdateEvent";
import UserProfile from "./screens/UserProfile";
import TopTabNavigator from "./TopTabNavigator";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();
  // const [unreadMessages, setUnreadMessages] = useState(25);
  // console.log(user);
  // useEffect(() => (
  //   onSnapshot(doc(db, 'users', user.uid), (snapshot) => setUnreadMessages(snapshot.data().setUnreadMessages))
  // ), [db])

  // console.log(unreadMessages);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Dispatch" component={BottomTabNavigator} />
            <Stack.Screen name="MessageScreen" component={MessageScreen} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="InitAccountInfo" component={InitAccountInfo} />
            <Stack.Screen name="AddContact" component={AddContact} />
            <Stack.Screen name="AddEvent" component={AddEvent} />
            <Stack.Screen name="UpdateEvent" component={UpdateEvent} />
            <Stack.Screen name="EventModal" component={EventModal} />
          </Stack.Group>
          {/* <Stack.Screen name="Upcoming" component={Upcoming} />
          <Stack.Screen name="In Progress" component={InProgress} />
          <Stack.Screen name="Completed" component={Completed} /> */}
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}

export default StackNavigator
