import { View, Text, Dimensions, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { Ionicons } from 'react-native-vector-icons/';
import tw from "tailwind-rn";
import theme from '../../styles/theme.style';

const InProgressOthers = ({ showTasks, handleShowTasks, event, taskData }) => {
  const barColor = '#FFB742'

  // console.log("showTasks", showTasks)

  return (
    <>
      <ListItem
        // rightStyle={{ width: width / 3 }}
        // leftWidth={width / 3}
        containerStyle={styles.list}
      >
        {/* <ListItem.Content style={tw("flex-1 flex-row")}> */}
        <ListItem.Content style={tw("flex-1 flex-row")}>
          <ListItem.Content>
            <ListItem.Title style={styles.listTitle}>{event.title}</ListItem.Title>
            {event.organization ? (
              event.manager.isConfirmed === false ? (
                <ListItem.Subtitle style={styles.listSubtitle}>O: Waiting...</ListItem.Subtitle>
              ) : (
                <ListItem.Subtitle style={styles.listSubtitle}>O: {event.organization.displayName}</ListItem.Subtitle>
              )
            ) : (
              <ListItem.Subtitle style={styles.listSubtitle}>O: N/A</ListItem.Subtitle>
            )
            }
            <ListItem.Subtitle style={styles.listSubtitle}>M: {event.manager.displayName}</ListItem.Subtitle>
            {event.freelancer ? (
              event.freelancer.isConfirmed === true ? (
                <ListItem.Subtitle style={[styles.listSubtitle, { fontWeight: 'bold', opacity: 1 }]}>F: {event.freelancer.displayName}</ListItem.Subtitle>
              ) : (
                <ListItem.Subtitle style={[styles.listSubtitle]}>F: Waiting...</ListItem.Subtitle>
              )
            ) : (
              <ListItem.Subtitle style={[styles.listSubtitle]}>F: Unassigned</ListItem.Subtitle>
            )}

          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title style={styles.listTitle}>{event.startTime} - {event.endTime}</ListItem.Title>
            <ListItem.Subtitle style={styles.listSubtitle}>{event.location.location}</ListItem.Subtitle>
            <ListItem.Subtitle style={styles.listSubtitle}>Completed: {taskData.completed} / {taskData.completedMax}</ListItem.Subtitle>
            <ListItem.Subtitle style={styles.listSubtitle}>On Task: {taskData.onTask} / {taskData.onTaskMax}</ListItem.Subtitle>

          </ListItem.Content>
          {/* <ListItem.Chevron color={theme.PRIMARY_BACKGROUND} /> */}
        </ListItem.Content>
        <ListItem.Content style={styles.chevron}>
          <View style={tw("flex-1 flex-row")}></View>
          {showTasks ? (
            <View><Ionicons onPress={handleShowTasks} name="chevron-up" size={24} color={theme.FONT_COLORS} /></View>
          ) : (
            <View><Ionicons onPress={handleShowTasks} name="chevron-down" size={24} color={theme.FONT_COLORS} /></View>
          )}

        </ListItem.Content>
        <ListItem.Content
          style={[styles.colorBar, { backgroundColor: barColor }]}
        ></ListItem.Content>

        {/* </ListItem.Content> */}
      </ListItem>
      {/* <TaskList inProgress event={event} /> */}
    </>
  );
};

export default InProgressOthers;

const styles = StyleSheet.create({
  list: {
    position: 'relative',
    width: '100%',
    marginVertical: 8,
    backgroundColor: theme.CARD_BACKGROUND,
    borderWidth: 0.5,
    borderColor: theme.PRIMARY_BACKGROUND_200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.33,
    shadowRadius: 1,
    elevation: 2,
  },
  listTitle: {
    color: theme.FONT_COLORS,
    fontWeight: 'bold',
    marginBottom: 4
  },
  listSubtitle: {
    color: theme.FONT_COLORS,
    opacity: 0.75,
    fontSize: 12
  },
  colorBar: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    height: 3,
    width: '110%',

  },
  chevron: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  }
})
