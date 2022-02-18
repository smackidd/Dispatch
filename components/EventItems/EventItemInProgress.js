import { View, Text, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import useAuth from "../../hooks/useAuth";
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../Firebase';
import InProgressFreelancer from './InProgressFreelancer';
import InProgressOthers from './InProgressOthers';

const { width } = Dimensions.get("window");


const EventItemInProgress = ({ showTasks, handleShowTasks, event }) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [taskData, setTaskData] = useState({});

  useEffect(() => {
    let completedMax = event.tasks.length;
    let completed = 0;
    let onTaskMax = event.tasks.length;
    let onTask = event.tasks.length;
    event.tasks.map((task) => {
      if (task.isCompleted === true) {
        completed = completed + 1;
        onTaskMax = onTaskMax - 1;
        onTask = onTask - 1;
      }
    })
    const task = { completedMax, completed, onTaskMax, onTask }
    // console.log("taskData", task);
    setTaskData(task);
  }, [event])

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  }

  return (
    <View>
      {user.role === "Freelancer" ? (
        <InProgressFreelancer event={event} taskData={taskData} />
      ) : (
        <InProgressOthers showTasks={showTasks} handleShowTasks={handleShowTasks} event={event} taskData={taskData} />
      )}
    </View>
  );
};

export default EventItemInProgress;
