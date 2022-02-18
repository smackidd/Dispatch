import { deleteDoc, doc } from 'firebase/firestore';
import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Button, Icon } from 'react-native-elements';
import { ListItem } from 'react-native-elements'
import { db } from '../../Firebase';
import useAuth from '../../hooks/useAuth';
import theme from "../../styles/theme.style";

const { width } = Dimensions.get("window");

const RejectedEvent = ({ alert }) => {
  const { user } = useAuth();
  const onDelete = async () => {
    const alertRef = doc(db, 'users', user.uid, 'alerts', alert.id);
    await deleteDoc(alertRef);
  }

  return (
    <ListItem.Swipeable
      rightContent={
        <Button
          title="Delete"
          icon={{ name: 'delete', color: theme.FONT_COLORS }}
          buttonStyle={{ color: theme.FONT_COLORS, minHeight: '100%', backgroundColor: theme.ALERT_OFF }}
          onPress={onDelete}
        />
      }
      rightStyle={{ width: width / 3 }}
      leftWidth={width / 3}
      containerStyle={styles.list}
    >
      {/* <Icon name="person-add" color={theme.ALERT_OFF} /> */}
      <ListItem.Content>
        <ListItem.Title>{alert.message}</ListItem.Title>
      </ListItem.Content>
      <Icon name="event-busy" color={theme.ALERT_OFF} />

      <ListItem.Chevron color={theme.PRIMARY_BACKGROUND} />
    </ListItem.Swipeable>
  )

};

export default RejectedEvent;

const styles = StyleSheet.create({
  list: {
    width: '100%',
    backgroundColor: theme.FONT_COLORS,
    // borderWidth: 0.5,
    // borderColor: theme.PRIMARY_BACKGROUND_200,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 2,
    //   height: 3,
    // },
    // shadowOpacity: 0.33,
    // shadowRadius: 1.33,
    // elevation: 2,
  },
})