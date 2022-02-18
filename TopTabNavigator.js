import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Upcoming from './screens/Upcoming';
import InProgress from './screens/InProgress';
import Completed from './screens/Completed';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from './hooks/useAuth';
import { TwitterAuthProvider } from 'firebase/auth';
import tw from "tailwind-rn";
import theme from './styles/theme.style.js';
import Header from './components/Header';
import { useRoute } from '@react-navigation/native';
import AddEventFAB from './components/AddEventFAB';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from './Firebase';
import moment from "moment";

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    let unsub;
    const fetchEvents = async () => {
      unsub = onSnapshot(query(collection(db, 'events'),
        where('assignments', 'array-contains', user.uid),
        orderBy('date')
      ),
        (snapshot) => {
          const events = [];
          snapshot.docs.map((doc) => { events.push(doc.data()) })
          console.log("here")
          // this assigns events to upcoming, inProgress and completed screens
          let upcomingList = [];
          let inProgressList = [];
          let completedList = [];
          events.map((event) => {
            if (moment().isBefore(event.date, 'day') && event.isCompleted === false) { upcomingList.push(event); }
            else if (moment().isSame(event.date, 'day') && event.isCompleted === false) { inProgressList.push(event); }
            // might need to update database with isCompleted: true if the event has ended. 
            else completedList.push(event)
          })
          setUpcoming(upcomingList);
          setInProgress(inProgressList);
          setCompleted(completedList);
        })
    }
    fetchEvents();
    return unsub;
  }
    , [db])

  return (
    <>
      <View >
        <Header />
      </View>

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
        <Tab.Screen name="Upcoming" children={() => <Upcoming events={upcoming} />} />
        <Tab.Screen name="In Progress" children={() => <InProgress events={inProgress} />} />
        <Tab.Screen name="Completed" children={() => <Completed events={completed} />} />
      </Tab.Navigator>

      {user.role != "Freelancer" && <AddEventFAB />}

    </>
  )
}

export default TopTabNavigator
