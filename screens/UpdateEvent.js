import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import theme from "../styles/theme.style";
import tw from "tailwind-rn";
import { Controller, useForm } from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import useAuth from '../hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../Firebase';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import sendAlert from '../lib/sendAlert';
import TaskList from '../components/TaskList';

////
//
// Todo: 
// - Fix setRoleItems in useEffect for dropdown data
// - Handle Assigning an Organization or a Manager.
//
////

const UpdateEvent = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { params } = useRoute();
  const { eventId } = params;
  const [event, setEvent] = useState(null);
  const [roleData, setRoleData] = useState([]);
  const [templateData, setTemplateData] = useState([]);
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleValue, setRoleValue] = useState(null);
  const [roleItems, setRoleItems] = useState([]);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({

  })

  useEffect(() => {
    console.log("here")
    const fetchEvent = async () => {
      console.log(eventId)
      const eventDetails = await getDoc(doc(db, 'events', eventId))

      console.log('eventDetails', eventDetails.data());
      setEvent(eventDetails.data());
      setRoleValue(eventDetails.data().freelancer);
      reset({
        title: eventDetails.data().title,
        date: eventDetails.data().date,
        startTime: eventDetails.data().startTime,
        endTime: eventDetails.data().endTime,
        location: eventDetails.data().location.location,
        address: eventDetails.data().location.address,
        city: eventDetails.data().location.city,
        role: eventDetails.data().freelancer
      })
    }
    fetchEvent();

    const fetchDropDownData = async () => {
      // if Organization, grab a list of Managers
      if (user.role == "Organization") {
        await getDocs(query(collection(db, 'contacts')),
          where('usersMatched', 'array-contains', user.uid))
          .then((snapshot) => setRoleData(snapshot.docs.map((doc) => getMatchedUserInfo(doc.data().users, user.uid)).filter((doc) => doc.role == "Manager")))
        // if Manager, grab list of Freelancers
      } else if (user.role == "Manager") {
        await getDocs(query(collection(db, 'contacts')),
          where('usersMatched', 'array-contains', user.uid))
          .then((snapshot) => {
            console.log("here")
            setRoleItems(
              snapshot.docs
                .filter((doc) => getMatchedUserInfo(doc.data().users, user.uid).role == "Freelancer")
                .map((doc) => ({ label: getMatchedUserInfo(doc.data().users, user.uid).displayName, value: getMatchedUserInfo(doc.data().users, user.uid), ...roleData }))
              // .map((doc) => console.log(getMatchedUserInfo(doc.data().users, user.uid).displayName))
            )
            console.log("roleData", roleItems)
          })

        // snapshot.docs
        //   .filter((doc) => getMatchedUserInfo(doc.data().users, user.uid).role == "Freelancer")
        //   .map((doc) => setRoleData([...roleData, { label: getMatchedUserInfo(doc.users, user.uid).displayName, value: getMatchedUserInfo(doc.users, user.uid).id }]))


        // )
        // .then((doc) => console.log(roleItems))
        // await console.log("role data", roleData)
        await getDocs(collection(db, 'users', user.uid, 'eventTemplates'),
          (snapshot) => { if (snapshot.exists()) setTemplateData(snapshot.docs.map((doc) => ([...templateData, doc.data().templateName]))) })

        //console.log(roleItems);
      }

    }
    fetchDropDownData();
  }, [])



  const onSubmit = async (data) => {
    // console.log("data.role", data.role)

    // if the role has been updated
    if (data.role.id != event.freelancer.id) {
      data.role.isConfirmed = false;

      //TEST THIS!!!!
      const oldMessage = `${user.displayName} (${user.role}) has removed you from the event: ${event.title}, ${event.date}.`;
      const message = `${user.displayName} (${user.role}) has invited you to an event: ${data.title}, ${data.date} ${data.startTime}. Click to view.`
      const relevantInfo = { eventId: event.id, usersMatched: [user.uid, data.role.id] };
      sendAlert('default', oldMessage, null, event.freelancer.id);
      sendAlert('newEvent', message, relevantInfo, data.role.id)
    } else {
      data.role.isConfirmed = true;
    }


    const userData = {
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role
    }
    const organization = user.role === 'Organization' ? userData : null;
    const organizationId = organization ? organization.id : null;
    const manager = user.role === 'Organization' ? data.role : userData;
    const managerId = manager ? manager.id : null;
    const freelancer = user.role === 'Organization' ? null : data.role;
    const freelancerId = freelancer ? freelancer.id : null;
    const docRef = await setDoc(doc(db, 'events', event.id), {
      id: event.id,
      title: data.title,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      location: {
        location: data.location,
        address: data.address,
        city: data.city
      },
      organization: organization,
      manager: manager,
      freelancer: freelancer,
      assignments: [organizationId, managerId, freelancerId],
      isCompleted: false,
      completedTime: null,
      createdBy: user.uid
    })
      .catch((error) => alert(error.message))

    navigation.navigate('Dispatch');
  }

  console.log("event", event);

  return (
    <View style={[tw("flex-1 p-8"), { backgroundColor: theme.PRIMARY_BACKGROUND }]}>
      <View style={tw("items-center mt-5 mb-2")}>
        <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>Update an Event</Text>
      </View>

      <ScrollView style={tw("flex-auto")}>
        {/* <View style={tw("flex-1 flex-col mb-16")}> */}
        <View style={tw("flex-1 flex-col")}>
          <View style={tw("flex-1")}>
            <Controller
              control={control}
              rules={{ required: true, minLength: 4, maxLength: 100 }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.input}>
                  <TextInput
                    value={value}
                    // defaultValue={event?.title}
                    onChangeText={onChange}
                    style={styles.textInput}
                    placeholder="Title"
                    placeholderTextColor={theme.FONT_COLORS}
                  />
                </View>
              )}
              name="title"
            />
          </View>
          {errors.title && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Title is required.</Text>}

          <View style={tw("flex-1 flex-row")}>
            <View style={{ flexGrow: 3 }}>
              <Controller
                control={control}
                rules={{ required: true, minLength: 10, maxLength: 10 }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.input}>
                    <TextInput
                      value={value}
                      // defaultValue={event?.date}
                      onChangeText={onChange}
                      style={styles.textInput}
                      placeholder="Date (mm/dd/yyyy)"
                      placeholderTextColor={theme.FONT_COLORS}
                    />
                  </View>
                )}
                name="date"
              />
            </View>
            <View style={tw("flex-col")}>
              <Controller
                control={control}
                rules={{ required: true, minLength: 4, maxLength: 5 }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.input}>
                    <TextInput
                      value={value}
                      // defaultValue={event?.startTime}
                      onChangeText={onChange}
                      style={styles.textInput}
                      placeholder="start (hh:mm)"
                      placeholderTextColor={theme.FONT_COLORS}
                    />
                  </View>
                )}
                name="startTime"
              />
              <Controller
                control={control}
                rules={{ minLength: 4, maxLength: 5 }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.input}>
                    <TextInput
                      value={value}
                      // defaultValue={event?.endTime}
                      onChangeText={onChange}
                      style={styles.textInput}
                      placeholder="end (hh:mm)"
                      placeholderTextColor={theme.FONT_COLORS}
                    />
                  </View>
                )}
                name="endTime"
              />
            </View>
          </View>
          {errors.date && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Date is required (mm/dd/yyyy).</Text>}
          {errors.startTime && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Start time is required (mm:hh).</Text>}
          {errors.endTime && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>End time must be mm:hh.</Text>}

          <View style={{ height: 2, width: "100%", marginBottom: 10, backgroundColor: theme.PRIMARY_BACKGROUND_200 }} />

          <View style={tw("flex-1")}>
            <Controller
              control={control}
              rules={{ required: true, minLength: 4, maxLength: 100 }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.input}>
                  <TextInput
                    value={value}
                    // defaultValue={event?.location.location}
                    onChangeText={onChange}
                    style={styles.textInput}
                    placeholder="Location Name"
                    placeholderTextColor={theme.FONT_COLORS}
                  />
                </View>
              )}
              name="location"
            />
          </View>
          {errors.location && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Location name is required.</Text>}
          <View style={tw("flex-1")}>
            <Controller
              control={control}
              rules={{ required: true, minLength: 4, maxLength: 100 }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.input}>
                  <TextInput
                    value={value}
                    defaultValue={event?.location.address}
                    onChangeText={onChange}
                    style={styles.textInput}
                    placeholder="Address"
                    placeholderTextColor={theme.FONT_COLORS}
                  />
                </View>
              )}
              name="address"
            />
          </View>
          {errors.address && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Address is required.</Text>}
          <View style={tw("flex-1")}>
            <Controller
              control={control}
              rules={{ minLength: 4, maxLength: 100 }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.input}>
                  <TextInput
                    value={value}
                    defaultValue={event?.location.city}
                    onChangeText={onChange}
                    style={styles.textInput}
                    placeholder="City"
                    placeholderTextColor={theme.FONT_COLORS}
                  />
                </View>
              )}
              name="city"
            />
          </View>
          {errors.city && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>City length is out of bounds</Text>}
        </View>

        <View style={{ height: 2, width: "100%", marginBottom: 10, backgroundColor: theme.PRIMARY_BACKGROUND_200 }} />
        <Text style={[tw("text-lg mb-4"), { color: theme.FONT_COLORS }]}>Template:</Text>

        <View>
          <TaskList event={event} />
        </View>

      </ScrollView>

      <View style={{ height: 2, width: "100%", marginBottom: 10, backgroundColor: theme.PRIMARY_BACKGROUND_200 }} />

      <View style={tw("flex-row")}>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.input}>
              <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>{user.role === 'Organization' ? 'Assign a Manager' : 'Assign a Freelancer'}</Text>
              <DropDownPicker
                open={roleOpen}
                value={roleValue}
                items={roleItems}
                setOpen={setRoleOpen}
                setValue={setRoleValue}
                setItems={setRoleItems}

                onSelectItem={(itemValue) => onChange(itemValue)}
                // buttonTextAfterSelection={(selectItem) => selectItem}
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropDownContainerStyle={styles.dropdownContainer}
                placeholder={roleValue?.displayName || 'Unassigned'}
              // disableBorderRadius
              />

            </View>
          )}
          name="role"
        />
      </View>
      {errors.role && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Role is required.</Text>}


      {/* <View style={tw("flex-row")}>
            <Controller
              control={control}
              rules={{}}
              render={({ field: { onChange } }) => (
                <View style={styles.input}>
                  <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>Select an Event Template</Text>
                  <SelectDropdown
                    data={templateData}
                    onSelect={(itemValue, itemIndex) => onChange(itemValue)}
                    buttonTextAfterSelection={(selectItem) => selectItem}
                    buttonStyle={styles.dropdown}
                    buttonTextStyle={styles.dropdownText}
                  />

                </View>
              )}
              name="template"
            />
          </View>
          {errors.template && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Role is required.</Text>} */}


      {/* </View> */}
      <View style={tw("mb-8")}>
        <TouchableOpacity
          style={[styles.buttonStyle]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[tw("text-center"), styles.buttonText]}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdateEvent;

const styles = StyleSheet.create({
  container: {

  },
  dropdown: {
    height: 50,
    borderColor: theme.FONT_COLORS,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: theme.PRIMARY_BACKGROUND,

    marginTop: 4,
    marginRight: 4,
    marginBottom: 16,
  },
  dropdownContainer: {
    backgroundColor: theme.PRIMARY_BACKGROUND_200,
    borderColor: theme.FONT_COLORS,
    borderRadius: 0
  },
  label: {
    position: 'absolute',
    backgroundColor: theme.PRIMARY_BACKGROUND,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  dropdownText: {
    color: theme.FONT_COLORS,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: theme.FONT_COLORS,
    fontSize: 16,
  },
  input: {
    flex: 1
  },
  textInput: {
    color: theme.FONT_COLORS,
    marginTop: 4,
    marginRight: 4,
    marginBottom: 16,
    padding: 4,
    height: 50,
    borderColor: theme.FONT_COLORS,
    backgroundColor: theme.PRIMARY_BACKGROUND,
    borderWidth: 0.5,
    borderRadius: 5
  },
  buttonStyle: {
    backgroundColor: theme.FONT_COLORS,

    borderRadius: 5,
    width: 150
  },
  buttonText: {
    color: theme.PRIMARY_BACKGROUND,
    padding: 16,
  },
  buttonEnabled: {
    backgroundColor: theme.FONT_COLORS
  },
  buttonDisabled: {
    backgroundColor: theme.DISABLED_BUTTON
  }
})
