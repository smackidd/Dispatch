import { collection, doc, getDoc, increment, updateDoc } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { View, Text, Image } from 'react-native';
import tw from "tailwind-rn";
import { db } from '../Firebase';
import useAuth from '../hooks/useAuth';

const ReceiverMessage = ({ message, matchDetails }) => {
  const { user } = useAuth();

  // this updates the message isViewed to true
  useEffect(() => {
    // console.log("received message")
    const fetchDocs = async () => {
      const messageRef = doc(db, 'contacts', matchDetails.id, 'messages', message.id);
      let isViewed = false;
      await getDoc(messageRef).then((snapshot) => {

        if (!snapshot.data().isViewed) {
          isViewed = true;
        }
      })
      if (isViewed) {
        updateDoc(messageRef, {
          isViewed: true
        })

        // this updates the unread message counter of the other user
        updateDoc(doc(db, 'users', user.uid), {
          unreadMessages: increment(-1)
        })
      }
    }
    fetchDocs();
  }, [])

  return (
    <View
      style={[
        tw("bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2"),
        { alignSelf: "flex-start", marginLeft: "auto" }
      ]}
    >
      <Text
        style={tw("text-white")}
      >{message.message}</Text>

    </View>
  )
}

export default ReceiverMessage
