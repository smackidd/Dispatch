import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import { db } from '../Firebase';
import TaskCard from './TaskCards/TaskCard';
import TaskCardInProgress from './TaskCards/TaskCardInProgress';

const TaskList = ({ inProgress = false, event }) => {
  // const [tasks, setTasks] = useState([]);

  // useEffect(() => {

  //   const fetchTasks = async () => {
  //     if (event.id) {
  //       const taskRef = await getDocs(collection(db, 'events', event.id, 'tasks'))
  //         .then((snapshot) => snapshot.docs.map((doc) => doc))
  //         .catch((error) => alert(error.message))

  //       const taskList = [];

  //       taskRef.forEach((doc) => {
  //         taskList.push(doc.data())
  //         setTasks(taskList);
  //       })
  //       // console.log(tasks)

  //     }


  //   }
  //   fetchTasks();
  // }, [event])
  // console.log("eventId", event.id);
  // console.log("tasks", tasks, "tasks");

  return (
    <View>
      {event.tasks && !inProgress ? (
        <FlatList
          data={event.tasks}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TaskCard task={item} />}
        />

      ) : (
        <FlatList
          data={event.tasks}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TaskCardInProgress event={event} task={item} />}
        />
      )
      }

    </View>
  );
};

export default TaskList;
