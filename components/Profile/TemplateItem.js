import { View, Text } from 'react-native'
import React from 'react'
import { Icon, ListItem } from 'react-native-elements'
import theme from "../../styles/theme.style";

const TemplateItem = ({ template }) => {
  const handleEdit = () => {
    console.log("handleEdit")
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