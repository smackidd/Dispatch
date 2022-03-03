import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Button, ListItem } from 'react-native-elements';
import TaskCard from './TaskCard';
import theme from "../../styles/theme.style";
import tw from "tailwind-rn";
import useAuth from '../../hooks/useAuth';
import { addDoc, arrayRemove, arrayUnion, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import moment from 'moment';
import TaskCardCompleted from './TaskCardCompleted';
import sendAlert from '../../lib/sendAlert';

const { width } = Dimensions.get("window");

const TaskCardInProgress = ({ event, task }) => {
  const { user } = useAuth();

  const handleDone = async () => {
    const completedTime = moment().toISOString();
    const eventRef = doc(db, 'events', event.id);
    const taskElement = { ...task, isCompleted: true, completedTime };
    const alertMessage = `${user.displayName} (${user.role}) has completed task: ${task.taskName} for event: ${event.title}`
    // console.log("taskElement", taskElement);
    await updateDoc(eventRef, {
      tasks: arrayRemove(task)
    })
    await updateDoc(eventRef, {
      tasks: arrayUnion(taskElement)
    })

    if (task.isOrgAlert === true && event.organization) {
      sendAlert('default', "Task Completed", alertMessage, relevantInfo = null, event.organization.id);
    }
    if (task.isManagerAlert === true && event.manager) {
      sendAlert('default', "Task Completed", alertMessage, relevantInfo = null, event.manager.id);
    }
  }

  const handleResume = async () => {
    const completedTime = null;
    const eventRef = doc(db, 'events', event.id);
    const taskElement = { ...task, isCompleted: false, completedTime };
    const alertMessage = `${user.displayName} (${user.role}) has resumed task: ${task.taskName} for event: ${event.title}`

    // console.log("taskElement", taskElement);
    await updateDoc(eventRef, {
      tasks: arrayRemove(task)
    })
    await updateDoc(eventRef, {
      tasks: arrayUnion(taskElement)
    })

    if (task.isOrgAlert === true && event.organization) {
      sendAlert('default', alertMessage, relevantInfo = null, event.organization.id);
    }
    if (task.isManagerAlert === true && event.manager) {
      sendAlert('default', alertMessage, relevantInfo = null, event.manager.id);
    }
  }

  return (
    user.role === "Freelancer" ? (
      <ListItem.Swipeable
        containerStyle={[tw("w-full p-0 mb-1"), { backgroundColor: theme.PRIMARY_BACKGROUND_200 }]}
        rightStyle={{ width: width / 4 }}
        leftWidth={width / 4}
        rightContent={
          task.isCompleted ? (
            <Button
              title="Resume"
              icon={{ name: 'playlist-add-check', color: theme.FONT_COLORS }}
              onPress={handleResume}
              buttonStyle={{ color: theme.FONT_COLORS, minHeight: '98%', backgroundColor: theme.ALERT_OFF }}
            />
          ) : (
            <Button
              title="Done"
              icon={{ name: 'playlist-add-check', color: theme.FONT_COLORS }}
              onPress={handleDone}
              buttonStyle={{ color: theme.FONT_COLORS, minHeight: '98%', backgroundColor: theme.ALERT_ON }}
            />
          )
        }
      >
        {task.isCompleted ? (
          <TaskCardCompleted task={task} />
        ) : (
          <TaskCard inProgress task={task} />
        )}
      </ListItem.Swipeable>

    ) : (
      <ListItem containerStyle={[tw("w-full p-0 mb-2"), { backgroundColor: theme.PRIMARY_BACKGROUND_200 }]}>
        {task.isCompleted ? (
          <TaskCardCompleted task={task} />
        ) : (
          <TaskCard inProgress task={task} />
        )}
      </ListItem>
    )
  );
};

export default TaskCardInProgress;


