import React, { useState, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TopTabNavigator from './TopTabNavigator';
import Alerts from './screens/Alerts';
import Messages from './screens/Messages';
import theme from './styles/theme.style.js';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './Firebase';
import { Badge } from 'react-native-elements';
import { useNavigation, useNavigationState } from '@react-navigation/native';


const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [unreadAlerts, setUnreadAlerts] = useState(null);
  const [alertPress, setAlertPress] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  // console.log("bottomTabNavigator")

  useEffect(() => {
    let unsub;
    const fetchUnread = () => {
      unsub = onSnapshot(query(collection(db, 'users', user.uid, 'alerts'),
        where('isViewed', '==', false)
      ),
        (snapshot) => {
          setUnreadAlerts(snapshot.docs.length);
        }
      )
    }
    fetchUnread();
    return unsub;
  }, [db]);



  // useEffect(() => {
  //   console.log("tabPress")
  //   const unsub = navigation.addListener('tabPress', (e) => {
  //     setAlertPress(alertPress + 1);
  //   })
  //   return unsub;
  // }, [navigation])

  // const handleAlertPress = () => {
  //   setAlertPress(alertPress + 1);
  //   console.log("alertPress", alertPress);
  // }

  return (
    <Tab.Navigator
      initialRouteName='Schedule'
      shifting={true}
      barStyle={{ backgroundColor: theme.CARD_BACKGROUND }}
    >
      <Tab.Screen
        name="Schedule"
        component={TopTabNavigator}
        options={{
          tabBarLabel: "Schedule",
          tabBarIcon: () => (
            <>
              <MaterialCommunityIcons name="calendar" color={theme.ICON_COLORS} size={26} />
            </>
          )
        }}
      />
      <Tab.Screen
        name="Alerts"
        // component={Alerts}
        children={() => <Alerts />}
        // tabPress={(e) => handleAlertPress()}
        options={{
          tabBarLabel: "Alerts",
          tabBarIcon: ({ focused }) => (
            <>
              <MaterialCommunityIcons name="bell" color={theme.ICON_COLORS} size={26} />
              {unreadAlerts > 0 && (
                <Badge status="error" value={unreadAlerts} containerStyle={{ position: 'absolute', top: 0, left: 17, zIndex: -10 }} />
              )}
            </>
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
