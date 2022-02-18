import { useNavigation } from '@react-navigation/native'
import { TwitterAuthProvider } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from "tailwind-rn";
import { db } from '../Firebase';
import { Entypo } from '@expo/vector-icons';
import theme from '../styles/theme.style';

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid))
  }, [matchDetails, user]);

  useEffect(() =>
    onSnapshot(query(collection(db, 'contacts', matchDetails.id, 'messages'),
      orderBy('timestamp', 'desc')
    ), snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
    ), [matchDetails, db]
  );

  return (
    <TouchableOpacity
      style={tw("flex-row items-center py-3 px-5 bg-white ")}
      onPress={() => navigation.navigate("MessageScreen", {
        matchDetails
      })}
    >
      <Image
        style={tw("rounded-full h-8 w-8 mr-4")}
        source={{ uri: matchedUserInfo?.photoURL }}
      />
      <View style={tw("w-3/4")}>
        <Text style={tw("text-lg font-semibold")}>
          {matchedUserInfo?.displayName}
        </Text>
        {matchDetails.isConfirmed ? (
          <Text>{lastMessage || "Connected..."}</Text>
        ) : (
          <Text>Awaiting Confirmation...</Text>
        )}
      </View>
      <View style={tw("")}>
        <Entypo name="chevron-small-right" size={24} color={theme.PRIMARY_BACKGROUND} />
      </View>
    </TouchableOpacity>
  )
}

export default ChatRow
