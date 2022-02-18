import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import tw from "tailwind-rn";
import { Foundation, Ionicons } from "@expo/vector-icons";
import theme from "../styles/theme.style";

const SubHeader = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={[tw("p-2 flex-row items-center justify-between"), { backgroundColor: theme.PRIMARY_BACKGROUND_200 }]}>
      <View style={tw("flex flex-row items-center")}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw("p-2")}>
          <Ionicons name="chevron-back-outline" size={34} color={theme.FONT_COLORS} />
        </TouchableOpacity>
        <View style={[tw("w-full py-2")]}>
          <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>{title}</Text>
        </View>
      </View>
    </View>
  )
}

export default SubHeader
