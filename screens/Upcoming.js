import { useNavigation, useRoute } from '@react-navigation/native'
import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native'
import { db } from '../Firebase';
import useAuth from '../hooks/useAuth';
import { Ionicons } from "@expo/vector-icons";
import theme from "../styles/theme.style";
import tw from "tailwind-rn";
import AddEventFAB from '../components/AddEventFAB';
import EventItem from '../components/EventItems/EventItem';
import moment from 'moment';

const { height } = Dimensions.get("window");


const Upcoming = ({ events }) => {
  const navigation = useNavigation();
  // console.log("Upcoming Events", events);
  const { user, logout } = useAuth();
  const [screenHeight, setScreenHeight] = useState(0);
  const scrollEnabled = screenHeight > (height - 160);
  // const [events, setEvents] = useState([
  // {
  //   assignments: [null, 'gayPfuKmHcezPhZRuR5tE4BmuBA3', 'fJHSNvu4TrXwI9sXOGXy8of1wZk1'],
  //   completedTime: null,
  //   date: "01/29/2022",
  //   endTime: "12:00",
  //   freelancer: {
  //     displayName: 'Steve m',
  //     email: 'stevemackidd@gmail.com',
  //     id: 'fJHSNvu4TrXwI9sXOGXy8of1wZk1',
  //     photoURL: 'https://lh3.googleusercontent.com/a/AATXAJy1sBBJsS_6oNPOvTxTaSR6DFV8RUB5mkbJsHsQ=s96-c',
  //     role: 'Freelancer'
  //   },
  //   isCompleted: false,
  //   location: {
  //     address: '1760 Douglas Glen Grove SE',
  //     city: 'Calgary',
  //     location: 'Home'
  //   },
  //   manager: {
  //     displayName: 'Tester',
  //     email: 'smackamaz1@gmail.com',
  //     id: 'gayPfuKmHcezPhZRuR5tE4BmuBA3',
  //     photoURL: null,
  //     role: 'Manager'
  //   },
  //   organization: null,
  //   startTime: "11:00",
  //   title: 'Funeral: Mr. Soandso'
  // },
  // ]);

  //console.log("user", user, "upcoming");

  useLayoutEffect(() =>
    onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      console.log(!snapshot.exists());
      if (!snapshot.exists()) { navigation.navigate('InitAccountInfo') };
    })
    , []);

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  }

  return (
    <View style={[tw("h-full"), { backgroundColor: theme.PRIMARY_BACKGROUND }]}>
      <View style={{ height: '100%' }}>
        <FlatList
          style={tw("h-full")}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={onContentSizeChange}
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <>
              <View style={tw("w-full mx-4 mt-2")}>
                <Text style={{ color: theme.FONT_COLORS, opacity: 0.8 }}>{moment(item.date).format('ddd. MMM Do, YYYY')}</Text>
                {/* <Text style={{ color: theme.FONT_COLORS, opacity: 0.8 }}>{item.date}</Text> */}
              </View>
              <TouchableOpacity onPress={() => {
                // console.log("item.id", item)
                navigation.navigate('EventModal', { eventId: item.id, alert: null })
              }}>
                <EventItem event={item} />
              </TouchableOpacity>
            </>
          )}
        />

      </View>

    </View>
  )
}

export default Upcoming

