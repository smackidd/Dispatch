import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from "tailwind-rn";
import theme from "../styles/theme.style";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import useAuth from '../hooks/useAuth';
import { MaterialIcons, FontAwesome5 } from 'react-native-vector-icons/';
import TaskList from '../components/TaskList';


const EventModal = () => {
  const { params } = useRoute();
  const { eventId, alert } = params;
  const [event, setEvent] = useState({});
  const { user } = useAuth();
  const navigation = useNavigation();



  useEffect(() => {
    const fetchEvent = async () => {
      console.log(eventId)
      const eventDetails = await getDoc(doc(db, 'events', eventId));
      setEvent(eventDetails.data());
      console.log(event)
    }
    fetchEvent();
  }, [])

  const handleAccept = async () => {
    console.log("Accepted")
    // id might contain Organization ids and/or Manager ids. 
    // NEED TO HANDLE THIS!!!!
    const id = alert.relevantInfo.usersMatched.filter((match) => match != user.uid);
    const eventRef = doc(db, 'events', eventId);
    const oldAlertRef = doc(db, 'users', user.uid, 'alerts', alert.id);
    const newAlertRef = collection(db, 'users', id[0], 'alerts');

    if (user.role === 'Freelancer') {
      await updateDoc(eventRef, {
        "freelancer.isConfirmed": true,
        timestamp: serverTimestamp(),
      })
    } else if (user.role === "Manager") {
      await updateDoc(eventRef, {
        "manager.isConfirmed": true,
        timestamp: serverTimestamp(),
      })
    } else if (user.role === "Organization") {
      await updateDoc(eventRef, {
        "organization.isConfirmed": true,
        timestamp: serverTimestamp(),
      })
    }

    await updateDoc(oldAlertRef, {
      alertType: "default",
      timestamp: serverTimestamp(),
    })

    await addDoc(newAlertRef, {
      timestamp: serverTimestamp(),
      alertType: 'default',
      title: 'Event Invite Accepted',
      message: `${user.displayName} (${user.role}) has confirmed event: ${event.title}, ${event.date} ${event.startTime}`,
      isViewed: false,
      relevantInfo: null
    })

    navigation.navigate('Alerts');
  }

  const handleReject = async () => {
    console.log("Rejected")
    // handle assignments filter out user.uid 
    const id = alert.relevantInfo.usersMatched.filter((match) => match != user.uid);
    const eventRef = doc(db, 'events', eventId);
    const oldAlertRef = doc(db, 'users', user.uid, 'alerts', alert.id);
    const newAlertRef = collection(db, 'users', id[0], 'alerts');

    if (user.role === 'Freelancer') {
      await updateDoc(eventRef, {
        freelancer: null,
        timestamp: serverTimestamp(),
      })
    } else if (user.role === "Manager") {
      await updateDoc(eventRef, {
        manager: null,
        timestamp: serverTimestamp(),
      })
    } else if (user.role === "Organization") {
      await updateDoc(eventRef, {
        organization: null,
        timestamp: serverTimestamp(),
      })
    }

    await updateDoc(oldAlertRef, {
      alertType: "default",
      timestamp: serverTimestamp(),
    })

    await addDoc(newAlertRef, {
      timestamp: serverTimestamp(),
      alertType: 'rejectedEvent',
      title: 'Event Invited Rejected',
      message: `${user.displayName} (${user.role}) has REJECTED event: ${event.title}, ${event.date} ${event.startTime}`,
      isViewed: false,
      relevantInfo: null
    })

    navigation.goBack();
  }

  return (
    <View style={[tw("flex-1 px-6 py-8"), { backgroundColor: theme.PRIMARY_BACKGROUND }]}>
      <View style={tw("flex-row mt-5 mb-2")}>
        <View style={tw("flex-1 mr-2")}>
          <Text style={[tw("text-xl font-bold mb-4"), { color: theme.FONT_COLORS }]}>{event.title}</Text>

        </View>
        <View style={tw("flex-1")}>
          <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>{event.startTime} - {event.endTime}</Text>
          <Text style={[tw("text-xl font-bold mb-4"), { color: theme.FONT_COLORS }]}>{event.date}</Text>
        </View>
        {/* If this is opened by the creator of event then display the EDIT Icon*/}
        {event.createdBy === user.uid && (
          <View style={tw("flex-none")}>
            <TouchableOpacity onPress={() => navigation.navigate('UpdateEvent', { eventId: event.id })}>
              <FontAwesome5 name="edit" color={theme.ACCENT_COLOR} size={26} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView>
        <View style={tw("flex-row")}>
          <View style={tw("flex-1 mb-2")}>
            <View style={tw("mb-2")}>
              <Text style={[tw("text-lg"), { color: theme.FONT_COLORS }]}>Organization:</Text>
              <Text style={[tw("text-lg"), { color: theme.FONT_COLORS }]}>{event.organization ? event.organization.displayName : 'N/A'}</Text>
            </View>
            <View style={tw("mb-2")}>
              <Text style={[tw("text-lg"), { color: theme.FONT_COLORS }]}>Manager:</Text>
              <Text style={[tw("text-lg"), { color: theme.FONT_COLORS }]}>{event.manager ? event.manager.displayName : 'N/A'}</Text>
            </View>
            <View style={tw("mb-2")}>
              <Text style={[tw("text-lg font-bold"), { color: theme.FONT_COLORS }]}>Freelancer:</Text>
              <Text style={[tw("text-lg font-bold"), { color: theme.FONT_COLORS }]}>{event.freelancer ? event.freelancer.displayName : 'N/A'}</Text>
            </View>
          </View>
          <View style={tw("flex-1")}>
            <View style={tw("mb-2")}>
              <Text style={[tw("text-lg"), { color: theme.FONT_COLORS }]}>{event.location?.location}</Text>
              <Text style={[tw("text-lg"), { color: theme.FONT_COLORS }]}>{event.location?.address}</Text>
              <Text style={[tw("text-lg"), { color: theme.FONT_COLORS }]}>{event.location?.city}</Text>
            </View>
          </View>
        </View>


        <View style={{ height: 2, width: "100%", marginBottom: 10, backgroundColor: theme.PRIMARY_BACKGROUND_200 }} />

        <Text style={[tw("text-lg mb-4"), { color: theme.FONT_COLORS }]}>Template:</Text>


        <View>
          <TaskList event={event} />
        </View>

        <View style={{ height: 2, width: "100%", marginBottom: 10, backgroundColor: theme.PRIMARY_BACKGROUND_200 }} />

        <Text style={[tw("text-lg mb-4"), { color: theme.FONT_COLORS }]}>Additional Comments:</Text>

      </ScrollView>

      {/* If this is opened from the ALERT screen then display the confirmation buttons */}
      {alert && (
        <View style={tw(" w-full mt-4 mb-4")}>
          <View style={tw("flex-row w-full")}>
            <TouchableOpacity
              style={[tw("flex-1"), styles.buttonStyle, { backgroundColor: theme.FONT_COLORS, borderWidth: 1, borderColor: theme.ALERT_ON }]}
              onPress={handleAccept}
            >
              <Text style={[tw("text-center"), styles.buttonText,]}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tw("flex-1"), styles.buttonStyle, { backgroundColor: theme.PRIMARY_BACKGROUND, borderWidth: 1, borderColor: theme.ALERT_OFF }]}
              onPress={handleReject}
            >
              <Text style={[tw("text-center"), styles.buttonText, { color: theme.FONT_COLORS }]}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default EventModal;

const styles = StyleSheet.create({
  buttonStyle: {
    marginHorizontal: 5,
    borderRadius: 5,

  },
  buttonText: {
    color: theme.PRIMARY_BACKGROUND,
    padding: 16,
  },
})