import { View, Text } from 'react-native'
import React from 'react'
import { Icon, ListItem } from 'react-native-elements'
import theme from "../../styles/theme.style";
import { useNavigation } from '@react-navigation/native';

const TemplateItem = ({ template }) => {
  const navigation = useNavigation();

  const handleEdit = () => {
    navigation.navigate('EditTaskTemplate', { template });
  }

  const handleDelete = () => {
    console.log("handleDelete")
  }

  return (
    <ListItem>
      <ListItem.Content>
        <ListItem.Title>Name: {template.name}</ListItem.Title>
        <ListItem.Subtitle>{template.tasks.length} tasks</ListItem.Subtitle>
      </ListItem.Content>
      <Icon onPress={handleEdit} name="edit" color={theme.ACCENT_COLOR} />
      <Icon onPress={handleDelete} name="delete" color={theme.ALERT_OFF} />
    </ListItem>
  )
}

export default TemplateItem