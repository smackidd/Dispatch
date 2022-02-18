import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ScrollView, Dimensions } from 'react-native'
import AlertItem from '../components/AlertItem'
import Header from '../components/Header'
import { db } from '../Firebase'
import useAuth from '../hooks/useAuth'
import tw from "tailwind-rn";
import theme from "../styles/theme.style";


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
  // console.log(scrollEnabled);
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
