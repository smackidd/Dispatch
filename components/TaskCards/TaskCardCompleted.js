import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import theme from "../../styles/theme.style";
import tw from "tailwind-rn";

const TaskCardCompleted = ({ task }) => {
  return (
    <View style={[tw("w-full p-2 mb-2"), { backgroundColor: theme.PRIMARY_BACKGROUND_200, borderRadius: 5 }]}>
      <View>
        <View style={tw("flex-row mb-2")}>
          <Text style={[tw("flex-1 font-bold"), styles.title]}>{task.taskName}</Text>
          <Text style={[tw("flex-none font-bold"), styles.title]}>{task.expCompletionTime}</Text>
        </View>
        <View style={tw("flex-row mb-2")}>
          <Text style={tw("flex-1")}></Text>
          <Text style={[tw("flex-none font-bold"), styles.title]}>Completed</Text>
        </View>
        <View style={tw("flex-row")}>
          <View style={tw("flex-1 flex-row")}>
            <Text style={styles.title}>Alert: </Text>
            <Text style={task.isAlert ? styles.alertOn : styles.alertOff}>{task.isAlert ? "On" : "Off"}</Text>
          </View>
          <View style={tw("flex-1 flex-row")}>
            <Text style={styles.title}>Org Alert: </Text>
            <Text style={task.isOrgAlert ? styles.alertOn : styles.alertOff}>{task.isOrgAlert ? "On" : "Off"}</Text>
          </View>
          <View style={tw("flex-none flex-row")}>
            <Text style={styles.title}>Manager Alert: </Text>
            <Text style={task.isManagerAlert ? styles.alertOn : styles.alertOff}>{task.isManagerAlert ? "On" : "Off"}</Text>
          </View>
        </View>
      </View>
    </View >
  );
};

export default TaskCardCompleted;

const styles = StyleSheet.create({
  title: {
    color: theme.FONT_COLORS,
    opacity: 0.5
  },
  alertOn: {
    color: theme.ALERT_ON
  },
  alertOff: {
    color: theme.ALERT_OFF
  }
});
