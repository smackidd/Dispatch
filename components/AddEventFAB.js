import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import theme from "../styles/theme.style";
import tw from "tailwind-rn";
import { useNavigation } from '@react-navigation/native';

const AddEventFAB = () => {
  const navigation = useNavigation();

  const addEvent = () => {
    navigation.navigate('AddEvent');
  }

  return (
    <View style={{ position: 'absolute', bottom: 5, right: 5, zIndex: 999 }}>
      <TouchableOpacity onPress={addEvent}>
        <Ionicons style={styles.shadow} name="add-circle" color={theme.ACCENT_COLOR} size={64} />
      </TouchableOpacity>
    </View >
  )
}

export default AddEventFAB

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