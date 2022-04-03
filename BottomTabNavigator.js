import React, { useState, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TopTabNavigator from './TopTabNavigator';
import Alerts from './screens/Alerts';
import Messages from './screens/Messages';
import theme from './styles/theme.style.js';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './Firebase';
import { Badge } from 'react-native-elements';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';


const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = ({ route }) => {
  // const { params } = route;
  // console.log("params", params.unreadMessages);
  // const { unreadMessages } = params;
  const navigation = useNavigation();
  const { user } = useAuth();
  const [unreadAlerts, setUnreadAlerts] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [alertPress, setAlertPress] = useState(0);

  useEffect(() => {
    let unsub, unsub2;
    const fetchUnread = () => {
      unsub = onSnapshot(query(collection(db, 'users', user.uid, 'alerts'),
        where('isViewed', '==', false)
      ),
        (snapshot) => {
          setUnreadAlerts(snapshot.docs.length);
        }
      )
      unsub2 = onSnapshot(doc(db, 'users', user.uid), (doc) => { if (doc.exists()) setUnreadMessages(doc.data().unreadMessages) })
    }
    fetchUnread();
    return unsub, unsub2;
  }, [db]);


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
        children={() => <Alerts />}
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
            <>
              <MaterialCommunityIcons name="message" color={theme.ICON_COLORS} size={26} />
              {unreadMessages > 0 && (
                <Badge status="error" value={unreadMessages} containerStyle={{ position: 'absolute', top: 0, left: 20, zIndex: -10 }} />
              )}
            </>
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabNavigator
