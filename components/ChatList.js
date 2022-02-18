import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { db } from '../Firebase';
import tw from "tailwind-rn";
import ChatRow from './ChatRow';
import useAuth from '../hooks/useAuth';

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(() =>
    onSnapshot(
      query(
        collection(db, 'contacts'),
        where('usersMatched', 'array-contains', user.uid)
      ),
      (snapshot) => setMatches(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })))
    ), [user]
  );
  console.log(user.uid);
  console.log(matches)

  return (
    matches.length > 0 ? (
      <FlatList
        style={tw("h-full")}
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatRow matchDetails={item} />}
      />
    ) : (
      <View style={tw("p-5")}>
        <Text style={tw("text-center text-lg")}>No matches at the moment</Text>
      </View>
    )
  )
}

export default ChatList
