import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth.js';
import theme from '../styles/theme.style.js';

const Header = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={[tw("flex-row items-center justify-between px-8 pt-5 relative"), { backgroundColor: theme.PRIMARY_BACKGROUND_200 }]}>
      <TouchableOpacity style={tw("")}>
        <Image style={tw("h-16 w-16 rounded-full")} source={require('../assets/DispatchLogo.png')} />
      </TouchableOpacity>
      <TouchableOpacity style={tw("")} onPress={() => navigation.navigate('UserProfile')}>
        <Image style={tw("h-10 w-10 rounded-full")} source={{ uri: user.photoURL }} />
      </TouchableOpacity>
    </View>
  )
}

export default Header
