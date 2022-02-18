import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { ListItem, Button, Icon } from 'react-native-elements';
import theme from "../../styles/theme.style";
import tw from "tailwind-rn";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import useAuth from '../../hooks/useAuth';

const { width } = Dimensions.get("window");

const ConnectionAlert = ({ alert }) => {
  const { user } = useAuth();

  const onAccept = async () => {
    // console.log("accepted");
    // console.log(alert.usersMatched)
    const id = alert.usersMatched.filter((match) => match != user.uid)
    // add connection logic and alert logic here
    const contactRef = doc(db, 'contacts', alert.contactId);
    const oldAlertRef = doc(db, 'users', user.uid, 'alerts', alert.id);
    const newAlertRef = collection(db, 'users', id[0], 'alerts');
    await updateDoc(contactRef, {
      isConfirmed: true,
      timestamp: serverTimestamp(),
    })
    await updateDoc(oldAlertRef, {
      alertType: "default",
      timestamp: serverTimestamp(),
    })
    await addDoc(newAlertRef, {
      timestamp: serverTimestamp(),
      alertType: 'default',
      message: `${user.displayName} (${user.role}) has confirmed contact.`,
      isViewed: false,
      relevantInfo: null
    })
  }

  const onDeny = async () => {
    // add delete connection and alert logic here
    const id = alert.usersMatched.filter((match) => match != user.uid)
    const contactRef = doc(db, 'contacts', alert.contactId);
    const oldAlertRef = doc(db, 'users', user.uid, 'alerts', alert.id);
    const newAlertRef = collection(db, 'users', id[0], 'alerts');
    await deleteDoc(contactRef);
    await updateDoc(oldAlertRef, {
      alertType: "default",
      timestamp: serverTimestamp(),
    });
    await addDoc(newAlertRef, {
      timestamp: serverTimestamp(),
      alertType: 'deniedConnection',
      message: `${user.displayName} (${user.role}) has DENIED contact.`,
      isViewed: false,
      relevantInfo: null
    });
  }

  return (
    <ListItem.Swipeable
      rightContent={
        <Button
          title="Add"
          icon={{ name: 'person-add', color: theme.FONT_COLORS }}
          buttonStyle={{ color: theme.FONT_COLORS, minHeight: '100%', backgroundColor: theme.ALERT_ON }}
          onPress={onAccept}
        />
      }
      leftContent={
        <Button
          title="Deny"
          icon={{ name: 'do-not-disturb', color: theme.FONT_COLORS }}
          buttonStyle={{ minHeight: '100%', backgroundColor: theme.ALERT_OFF }}
          onPress={onDeny}
        />
      }
      onLeftSwipe={() => setSwiping(true)}
      onRightSwipe={() => setSwiping(true)}
      rightStyle={{ width: width / 3 }}
      leftWidth={width / 3}
      containerStyle={styles.list}
    >
      {/* <Icon name="person-add" color={theme.ALERT_OFF} /> */}
      <ListItem.Content>
        <ListItem.Title>{alert.message}</ListItem.Title>
      </ListItem.Content>
      <Icon name="person-add" color={theme.ALERT_ON} />

      <ListItem.Chevron color={theme.PRIMARY_BACKGROUND} />
    </ListItem.Swipeable>
  );
};

export default ConnectionAlert;

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
