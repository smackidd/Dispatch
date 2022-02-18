import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import AddEventFAB from '../components/AddEventFAB'
import tw from "tailwind-rn";
import theme from "../styles/theme.style";
import EventItemInProgress from '../components/EventItems/EventItemInProgress';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import useAuth from '../hooks/useAuth';
import TaskList from '../components/TaskList';

const { height } = Dimensions.get("window");

const InProgress = ({ events }) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [screenHeight, setScreenHeight] = useState(0);
  const [showTasks, setShowTasks] = useState(false);
  const scrollEnabled = screenHeight > (height - 160);

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  }

  const handleShowTasks = (e) => {
    // console.log("here")
    setShowTasks(!showTasks);
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
                <EventItemInProgress showTasks={showTasks} handleShowTasks={() => handleShowTasks()} event={item} />
              </TouchableOpacity>
              {(user.role === "Freelancer" || showTasks === true) && (
                <TaskList inProgress event={item} />
              )}
            </>
          )}
        />

      </View>

    </View>
  )
}

export default InProgress
