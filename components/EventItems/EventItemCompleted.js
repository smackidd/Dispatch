import { View, Text, Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import { ListItem } from 'react-native-elements';
import theme from "../../styles/theme.style";
import tw from "tailwind-rn";

const { width } = Dimensions.get("window");

const EventItemCompleted = ({ event }) => {
  return (
    <View>
      <ListItem
        rightStyle={{ width: width / 3 }}
        leftWidth={width / 3}
        containerStyle={styles.list}
      >
        <ListItem.Content style={tw("flex-1 flex-row")}>
          <ListItem.Content>
            <ListItem.Title style={styles.listTitle}>{event.title}</ListItem.Title>
            {event.organization ? (
              event.manager.isConfirmed === false ? (
                <ListItem.Subtitle style={styles.listSubtitle}>O: Waiting...</ListItem.Subtitle>
              ) : (
                <ListItem.Subtitle style={styles.listSubtitle}>O: {event.organization.displayName}</ListItem.Subtitle>
              )
            ) : (
              <ListItem.Subtitle style={styles.listSubtitle}>O: N/A</ListItem.Subtitle>
            )
            }
            <ListItem.Subtitle style={styles.listSubtitle}>M: {event.manager.displayName}</ListItem.Subtitle>
            {event.freelancer ? (
              event.freelancer.isConfirmed === true ? (
                <ListItem.Subtitle style={[styles.listSubtitle, { fontWeight: 'bold', opacity: 1 }]}>F: {event.freelancer.displayName}</ListItem.Subtitle>
              ) : (
                <ListItem.Subtitle style={[styles.listSubtitle]}>F: Waiting...</ListItem.Subtitle>
              )
            ) : (
              <ListItem.Subtitle style={[styles.listSubtitle]}>F: Unassigned</ListItem.Subtitle>
            )}

          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title style={styles.listTitle}>{event.startTime} - {event.endTime}</ListItem.Title>
            <ListItem.Subtitle style={styles.listSubtitle}>{event.location.location}</ListItem.Subtitle>
            <ListItem.Subtitle style={styles.listSubtitle}>{event.location.address}</ListItem.Subtitle>
            <ListItem.Subtitle style={styles.listSubtitle}>{event.location.city}</ListItem.Subtitle>

          </ListItem.Content>
        </ListItem.Content>

        {/* s<ListItem.Chevron color={theme.PRIMARY_BACKGROUND} /> */}
      </ListItem>
    </View>
  );
};

export default EventItemCompleted;

const styles = StyleSheet.create({
  list: {
    position: 'relative',
    width: '100%',
    marginVertical: 8,
    backgroundColor: theme.CARD_BACKGROUND,
    borderWidth: 0.5,
    borderColor: theme.PRIMARY_BACKGROUND_200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.33,
    shadowRadius: 1,
    elevation: 2,
  },
  listTitle: {
    color: theme.PRIMARY_BACKGROUND,
    opacity: 0.75,
    fontWeight: 'bold',
    marginBottom: 4
  },
  listSubtitle: {
    color: theme.FONT_COLORS,
    opacity: 0.75,
    fontSize: 12
  },

})
