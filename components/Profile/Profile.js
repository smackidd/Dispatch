import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import useAuth from '../../hooks/useAuth';
import theme from '../../styles/theme.style';
import Header from '../Header';
import tw from "tailwind-rn";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <View style={{ height: '100%', backgroundColor: theme.FONT_COLORS }}>
      {user.role === "Freelancer" && (
        <View style={[tw("items-center w-full pb-2"), { backgroundColor: theme.PRIMARY_BACKGROUND_200 }]}>
          <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>PROFILE</Text>
        </View>
      )}
      <View style={{ backgroundColor: theme.FONT_COLORS }}>
        <Image style={tw("h-10 w-10 rounded-full")} source={{ uri: user.photoURL }} />
        <Text>{user.displayName}</Text>
        <Text>{user.role}</Text>
      </View>
      <TouchableOpacity
        style={[styles.buttonStyle]}
        onPress={logout}
      >
        <Text style={[tw("text-center"), styles.buttonText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: theme.PRIMARY_BACKGROUND,

    borderRadius: 5,
    width: 150
  },
  buttonText: {
    color: theme.FONT_COLORS,
    padding: 16,
  },

})