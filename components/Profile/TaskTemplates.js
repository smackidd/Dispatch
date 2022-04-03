import { View, Text, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react';
import theme from '../../styles/theme.style';
import useAuth from '../../hooks/useAuth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase';
import TemplateItem from './TemplateItem';
import tw from 'tailwind-rn';


const { height } = Dimensions.get("window");


const TaskTemplates = () => {
  const { user } = useAuth();
  const [taskTemplates, setTaskTemplates] = useState([]);
  const [screenHeight, setScreenHeight] = useState(0);
  const scrollEnabled = screenHeight > (height - 160);



  useEffect(() => {
    const fetchTaskTemplates = async () => {
      const docRef = collection(db, "users", user.uid, "taskTemplates");
      const snapshot = await getDocs(docRef);
      let templates = [];
      snapshot.forEach((doc) => {
        templates.push(doc.data())
      })
      setTaskTemplates(templates);
    }
    fetchTaskTemplates();
  }, [])

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  }

  return (
    <View style={{ height: '100%', backgroundColor: theme.FONT_COLORS }}>
      {taskTemplates.length > 0 && (
        <View style={{ height: height - 170 }}>
          <FlatList
            style={tw("h-full")}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={onContentSizeChange}
            data={taskTemplates}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              <TemplateItem template={item} />
            }
          />
        </View>
      )}
    </View>
  )
}

export default TaskTemplates