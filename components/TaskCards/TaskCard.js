import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import tw from "tailwind-rn";
import theme from "../../styles/theme.style";
import { ListItem } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import useAuth from '../../hooks/useAuth';
import moment from 'moment';
import Countdown from '../Countdown';

const TaskCard = ({ inProgress = false, task }) => {
  const { user } = useAuth();
  // console.log("task", task)
  // console.log("inProgress", inProgress)
  // console.log("expCompletionTime", moment(task.expCompletionTime).milliseconds());
  // const currentTime = moment().format('h:mm a');
  // const eventTime = task.expCompletionTime;
  // const eventTime = 1366549200;
  // const currentTime = 1366547400;
  // const diffTime = eventTime - currentTime;
  // const timeDiff = moment.duration(diffTime * 1000, 'milliseconds');

  // console.log(task.expCompletionTime)

  return (
    inProgress ? (
      <View style={[tw("w-full p-2 mb-2"), { backgroundColor: theme.PRIMARY_BACKGROUND_200, borderRadius: 5 }]}>
        <View>
          <View style={tw("flex-row mb-2")}>
            <Text style={[tw("flex-1 font-bold"), styles.title]}>{task.taskName}</Text>
            <Text style={[tw("flex-none font-bold"), styles.title]}>{task.expCompletionTime}</Text>
          </View>
          <View style={tw("flex-row mb-2")}>
            <Text style={tw("flex-1")}></Text>
            <Text style={[tw("flex-none font-bold"), styles.title]}>
              {/* <Countdown eventTime={moment(task.expCompletionTime).milliseconds()} interval={1000} /> */}
              <Countdown eventTime={moment(moment().format('YYYYMMDD') + " " + task.expCompletionTime, 'YYYYMMDD hh:mm a').format('x')} />
            </Text>
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
    ) : (
      <View style={[tw("w-full p-2 mb-2"), { backgroundColor: theme.PRIMARY_BACKGROUND_200, borderRadius: 5 }]}>
        <View>
          <View style={tw("flex-row mb-2")}>
            <Text style={[tw("flex-1 font-bold"), styles.title]}>{task.taskName}</Text>
            <Text style={[tw("flex-none font-bold"), styles.title]}>{task.expCompletionTime}</Text>
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
    )
    // <ListItem.Content style={[tw("w-full p-2 mb-2"), { backgroundColor: theme.PRIMARY_BACKGROUND_200, borderRadius: 5 }]}>
    //   <ListItem.Content>
    //     <ListItem.Content style={tw("flex-row mb-2")}>

    //     </ListItem.Content>
    //   </ListItem.Content>
    // </ListItem.Content>



  );
};

export default TaskCard;

const styles = StyleSheet.create({
  title: {
    color: theme.FONT_COLORS,

  },
  alertOn: {
    color: theme.ALERT_ON
  },
  alertOff: {
    color: theme.ALERT_OFF
  }
});
