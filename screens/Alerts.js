import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ScrollView, Dimensions } from 'react-native'
import AlertItem from '../components/AlertItem'
import Header from '../components/Header'
import { db } from '../Firebase'
import useAuth from '../hooks/useAuth'
import tw from "tailwind-rn";
import theme from "../styles/theme.style";
import { useNavigation, useNavigationState } from '@react-navigation/native'


/////
//
// Todo:
// -fix scrolling issues with swiping
// -add timestamps
// -add badge on alert icon to show # of unread alerts
// -send notification to device
// -add onDeny functionality to swipeable
//
/////

const { height } = Dimensions.get("window");

const Alerts = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [swiping, setSwiping] = useState(false);
  const [alerts, setAlerts] = useState([
    // {
    //   alertType: 'connection',
    //   id: 1,
    //   message: "Tester (Manager) wants to connect with you"
    // },
    // {
    //   alertType: 'connection',
    //   id: 2,
    //   message: "Tester (Manager) wants to connect with you"
    // },
    // {
    //   alertType: 'connection',
    //   id: 3,
    //   message: "Tester (Manager) wants to connect with you"
    // },
    // {
    //   alertType: 'connection',
    //   id: 4,
    //   message: "Tester (Manager) wants to connect with you"
    // },
    // {
    //   alertType: 'connection',
    //   id: 5,
    //   message: "Tester (Manager) wants to connect with you"
    // },
    // {
    //   alertType: 'connection',
    //   id: 6,
    //   message: "Tester (Manager) wants to connect with you"
    // },
    // {
    //   alertType: 'connection',
    //   id: 7,
    //   message: "Tester (Manager) wants to connect with you"
    // },
    // {
    //   alertType: 'connection',
    //   id: 8,
    //   message: "Tester (Manager) wants to connect with you"
    // },
    // {
    //   alertType: 'connection',
    //   id: 9,
    //   message: "Tester (Manager) wants to connect with you"
    // },

  ]);
  const [screenHeight, setScreenHeight] = useState(0);
  const scrollEnabled = screenHeight > (height - 160);

  // gets the index of the bottom tab navigation
  const index = useNavigationState(state => state.index);
  useEffect(() => {
    //if on Alerts page, then the alert is viewed
    if (index === 1) {
      // console.log("checking isViewed", alerts, user.displayName);
      const untouchedAlertTypes = ['newEvent', 'connection']
      alerts.map(async (alert) => {
        //if not an alert in the untouchedAlertTypes array above then the alert is viewed.
        if (!untouchedAlertTypes.includes(alert.alertType) && alert.isViewed === false) {
          console.log("alert.id", alert.id, "message", alert.message, "alertType", alert.alertType);
          const alertRef = doc(db, 'users', user.uid, 'alerts', alert.id);
          await updateDoc(alertRef, {
            isViewed: true,
            timestamp: serverTimestamp()
          })
          ////
          //
          // UPDATE ALERTS IN STATE 
          //
          ////
        }
      })
    }

  }, [index, alerts])

  useEffect(() =>
    onSnapshot(query(collection(db, 'users', user.uid, 'alerts'), orderBy('timestamp', 'desc')),
      (snapshot) => setAlerts(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })))
    )
    , [db])

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  }

  // console.log(alerts);

  return (
    <View style={{ height: '100%', backgroundColor: theme.FONT_COLORS }}>
      <Header />
      <View style={[tw("items-center w-full pb-2"), { backgroundColor: theme.PRIMARY_BACKGROUND_200 }]}>
        <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>ALERTS</Text>
      </View>
      {alerts.length > 0 ? (
        <View style={{ height: height - 170 }}>

          <FlatList
            style={tw("h-full")}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={onContentSizeChange}
            data={alerts}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              <AlertItem setSwiping={setSwiping} alert={item} />
            }
          />
        </View>
      ) : (
        <View></View>
      )}
    </View>
  )
}

export default Alerts
