import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { ListItem, Button, Icon } from 'react-native-elements';
import useAuth from '../../hooks/useAuth';
import theme from "../../styles/theme.style";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get("window");

const NewEventAlert = ({ alert }) => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const onAccept = async () => {

  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate('EventModal', { eventId: alert.relevantInfo.eventId, alert: alert })}>
      <ListItem

        // onLeftSwipe={() => setSwiping(true)}
        // onRightSwipe={() => setSwiping(true)}

        containerStyle={styles.list}
      >
        {/* <Icon name="person-add" color={theme.ALERT_OFF} /> */}
        <ListItem.Content>
          <ListItem.Title>{alert.message}</ListItem.Title>
        </ListItem.Content>
        <Icon name="event-note" color={theme.ALERT_ON} />

        <ListItem.Chevron color={theme.PRIMARY_BACKGROUND} />
      </ListItem>
    </TouchableOpacity>
  );
};

export default NewEventAlert;

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