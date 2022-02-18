import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react'
import { View, Text, Button, Image, TouchableOpacity, Pressable } from 'react-native'
import useAuth from '../hooks/useAuth'
import tw from "tailwind-rn";
import theme from '../styles/theme.style.js';


/////
//
// Todo:
// -add email login
//
/////

const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  })

  return (
    <View style={tw("flex-1 items-center relative")}>
      <View style={tw("flex-1 items-center justify-center h-1/2 w-full bg-gray-600")}>
        <Image style={tw("w-full h-full")} source={require('../assets/Dispatch.png')} />
      </View>
      <View style={[tw("flex-1 w-full items-center justify-center h-full relative"), { backgroundColor: theme.PRIMARY_BACKGROUND }]}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 32, backgroundColor: '#1613B2', borderRadius: 25 }} onPress={signInWithGoogle}>
          <Text style={{ color: 'white' }}>Sign In With Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LoginScreen
