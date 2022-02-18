import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

import Header from '../components/Header'
import theme from '../styles/theme.style'
import tw from "tailwind-rn";
import { useNavigation, useRoute } from '@react-navigation/native';
import ChatList from '../components/ChatList';

const Messages = () => {
  const navigation = useNavigation();



  const addConnection = () => {
    navigation.navigate("AddContact");
  }

  return (
    <View style={tw("h-full")}>
      <Header />
      <View style={[tw("items-center w-full pb-2"), { backgroundColor: theme.PRIMARY_BACKGROUND_200 }]}>
        <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>CONTACTS</Text>
      </View>

      <ChatList />

      <View style={{ position: 'absolute', bottom: 5, right: 5, zIndex: 999 }}>
        <TouchableOpacity onPress={addConnection}>
          <Ionicons style={styles.shadow} name="add-circle" color={theme.ACCENT_COLOR} size={64} />
        </TouchableOpacity>
      </View >
    </View>
  )
}

export default Messages;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.33,
    shadowRadius: 1.1,
    elevation: 2,
  }
})
