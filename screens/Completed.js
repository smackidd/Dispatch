import React, { useState } from 'react'
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import AddEventFAB from '../components/AddEventFAB';
import tw from "tailwind-rn";
import theme from "../styles/theme.style";
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import EventItem from '../components/EventItems/EventItem';
import EventItemCompleted from '../components/EventItems/EventItemCompleted';

const { height } = Dimensions.get("window");

const Completed = ({ events }) => {
  const navigation = useNavigation();
  const [screenHeight, setScreenHeight] = useState(0);
  const scrollEnabled = screenHeight > (height - 160);

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  }

  return (
    <View style={[tw("h-full"), { backgroundColor: theme.PRIMARY_BACKGROUND }]}>
      <View style={{ height: '100%' }}>
        <FlatList
          style={tw("h-full")}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={onContentSizeChange}
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <>
              <View style={tw("w-full mx-4 mt-2")}>
                <Text style={{ color: theme.FONT_COLORS, opacity: 0.8 }}>{moment(item.date).format('ddd. MMM Do, YYYY')}</Text>
                {/* <Text style={{ color: theme.FONT_COLORS, opacity: 0.8 }}>{item.date}</Text> */}
              </View>
              <TouchableOpacity onPress={() => {
                // console.log("item.id", item)
                navigation.navigate('EventModal', { eventId: item.id, alert: null })
              }}>
                <EventItemCompleted event={item} />
              </TouchableOpacity>
            </>
          )}
        />

      </View>

    </View>
  )
}

export default Completed
