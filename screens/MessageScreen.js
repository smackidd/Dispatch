import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList, TextInput, Button } from 'react-native'
import Header from '../components/Header'
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from "tailwind-rn";
import SubHeader from '../components/SubHeader';
import useAuth from '../hooks/useAuth';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import theme from '../styles/theme.style';


/////
//
// Todo:
// -Style and format messages properly
// -Fix lastMessage string length
// -Setup Message badge to determine unViewed number of messages
// -Setup timestamps
// -send notification to device
// -auto scroll to the bottom
//
/////

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  //Listen for messages and display them on the screen
  useEffect(() =>
    onSnapshot(query(collection(db, 'contacts', matchDetails.id, 'messages'), orderBy('timestamp', 'asc')),
      (snapshot) => setMessages(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })))
    ), [matchDetails, db]
  );

  const sendMessage = () => {
    addDoc(collection(db, 'contacts', matchDetails.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    })

    setInput("");
  }

  return (
    <View style={tw("h-full")}>
      <Header />
      <SubHeader title={getMatchedUserInfo(matchDetails.users, user.uid).displayName} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            // initialScrollIndex={messages.length - 1}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />

        </TouchableWithoutFeedback>
        <View
          style={tw("flex-row justify-between items-center bg-white border-t border-gray-200 px-5 py-2")}
        >
          <TextInput
            style={tw("h-10 text-lg")}
            placeholder='Send message...'
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button onPress={sendMessage} title="Send" color={theme.PRIMARY_BACKGROUND} />
        </View>

      </KeyboardAvoidingView>



    </View>
  )
}

export default MessageScreen
