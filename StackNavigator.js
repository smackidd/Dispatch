import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import React from 'react'
import { View, Text } from 'react-native'
import BottomTabNavigator from "./BottomTabNavigator";
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
import TopTabNavigator from "./TopTabNavigator";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();
  // console.log(user);

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
