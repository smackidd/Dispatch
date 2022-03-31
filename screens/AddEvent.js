import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { View, Text, ScrollView, StyleSheet, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
// import DatePicker from "react-multi-date-picker";
// import { MobileDatePicker } from "@mui/lab";
// import ReactDatePicker from 'react-datepicker';
import tw from "tailwind-rn";
import theme from "../styles/theme.style";
import SelectDropdown from 'react-native-select-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import generateId from '../lib/generateIds';
import { db } from '../Firebase';
import { useNavigation } from '@react-navigation/native';
import sendAlert from '../lib/sendAlert';
import TaskCard from '../components/TaskCards/TaskCard';
import { Icon, Input, Overlay } from 'react-native-elements';
import { MaterialCommunityIcons } from "react-native-vector-icons";
import moment from 'moment';

/////
//
// Todo:
// -Fix useEffect for all roles
//
/////

const AddEvent = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {

    }
  })
  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [startTimeFormatted, setStartTimeFormatted] = useState(moment().format('h:mm a'));
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [roleData, setRoleData] = useState([]);
  const [templateData, setTemplateData] = useState([]);
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleValue, setRoleValue] = useState(null);
  const [roleItems, setRoleItems] = useState([]);
  const [tasks, setTasks] = useState([
    {
      taskId: 1,
      taskName: 'Confirm Event',
      isAlert: true,
      isOrgAlert: true,
      isManagerAlert: true,
      relativeTime: { hours: -3, min: 0 },
      expCompletionTime: 'T -3:00',
      isCompleted: false,
      completedTime: null,
    },
    {
      taskId: 2,
      taskName: 'Arrival',
      isAlert: false,
      isOrgAlert: false,
      isManagerAlert: true,
      relativeTime: { hours: -1, min: 0 },
      expCompletionTime: 'T -1:00',
      isCompleted: false,
      completedTime: null,
    }
  ])
  // console.log("startTimeFormatted", startTimeFormatted);
  // console.log("expCompletionTime", tasks[0].expCompletionTime);

  const taskTimeFormat = (date, start) => {
    let newTasks = tasks;
    const startDate = date + " " + start;
    console.log(startDate)
    newTasks.map((task) => {
      // console.log("expCompletionTime", moment(startDate, 'MM/DD/YYYY h:mm a').add(task.relativeTime.hours, 'hours').add(task.relativeTime.min, 'minutes').format('MM/DD/YYYY h:mm a'))
      task.expCompletionTime = moment(startDate, 'MM/DD/YYYY h:mm a').add(task.relativeTime.hours, 'hours').add(task.relativeTime.min, 'minutes').format('MM/DD/YYYY h:mm a')
      //   console.log("task.expCompletionTime", task.expCompletionTime);
    })
    setTasks(newTasks);
  }

  useEffect(() => {
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
          // (snapshot) => setRoleData(snapshot.docs.users.filter((doc) => getMatchedUserInfo(doc, user.uid).role == "Freelancer")))
          // .then(
          .then((snapshot) => {
            console.log("here")
            const items = [{ label: 'Unassigned', value: null }]
            snapshot.docs
              .filter((doc) => getMatchedUserInfo(doc.data().users, user.uid).role == "Freelancer")
              .map((doc) => (items.push({ label: getMatchedUserInfo(doc.data().users, user.uid).displayName, value: getMatchedUserInfo(doc.data().users, user.uid), ...roleData })))
            // .map((doc) => console.log(getMatchedUserInfo(doc.data().users, user.uid).displayName))
            setRoleItems(items);
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
    // console.log("here");

  }, [db])

  const onSubmit = async (data) => {
    //console.log(user)
    data.role.value.isConfirmed = false;
    const userData = {
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role
    }
    const organization = user.role === 'Organization' ? userData : null;
    const organizationId = organization ? organization.id : null;
    const manager = user.role === 'Organization' ? data.role.value : userData;
    const managerId = manager ? manager.id : null;
    const freelancer = user.role === 'Organization' ? null : data.role.value;
    const freelancerId = freelancer ? freelancer.id : null;

    //update task completion time format to include date
    taskTimeFormat(data.date, data.startTime);

    const docRef = await addDoc(collection(db, 'events'), {
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
      createdBy: user.uid,
      tasks: tasks
    })
      .catch((error) => alert(error.message))

    await updateDoc(doc(db, 'events', docRef.id), {
      id: docRef.id
    })

    // tasks.map(async (task) => {
    //   const taskRef = await addDoc(collection(db, 'events', docRef.id, 'tasks'), { ...task })
    //   await updateDoc(doc(db, 'events', docRef.id, 'tasks', taskRef.id), { id: taskRef.id })
    // })
    //console.log("freelancer", freelancer, "freelancer")
    const message = `${user.displayName} (${user.role}) has invited you to an event: ${data.title}, ${data.date} ${data.startTime}. Click to view.`;
    // FIX THIS NEXT LINE TO HANDLE ORGANIZATION INVITES!!!
    const relevantInfo = { eventId: docRef.id, usersMatched: [manager.id, freelancer.id] };
    sendAlert('newEvent', "New Event Invite", message, relevantInfo, data.role.value.id);


    navigation.goBack();
  }

  return (
    <View style={[tw("flex-1 p-8"), { backgroundColor: theme.PRIMARY_BACKGROUND }]}>
      <View style={tw("items-center mt-5 mb-2")}>
        <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>Add an Event</Text>
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
              {/* DATETIMEPICKER */}
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.input}>
                    <TextInput
                      value={value}
                      style={styles.textInput}
                      placeholderTextColor={theme.FONT_COLORS}
                      onPressIn={() => { setDateOpen(true); setDate(new Date()); }}
                      onChangeText={() => onChange(date?.toISOString().split('T')[0])}
                      containerStyle={styles.textInput}
                      placeholder="Select date..."
                    />
                    {dateOpen === true && (Platform.OS === 'ios' ? (
                      <Overlay
                        backdropStyle={{ flex: 1, padding: 5, backgroundColor: theme.PRIMARY_BACKGROUND, opacity: 0.8 }}
                        overlayStyle={{ backgroundColor: theme.PRIMARY_BACKGROUND_200, borderRadius: 10 }}
                        onBackdropPress={() => setDateOpen(false)}
                      >
                        <DateTimePicker
                          testID="dateTimePicker"
                          mode="date"
                          value={date ? date : new Date()}
                          display="spinner"
                          style={{ height: 300, width: 300, marginBottom: 4 }}
                          textColor={theme.FONT_COLORS}
                          onChange={(event, date) => {
                            const formattedDate = moment(date).format('L');
                            setDate(date)
                            if (event.type === "dismissed") onChange()
                            else onChange(formattedDate)
                          }}
                        />
                        <TouchableOpacity style={{ backgroundColor: theme.FONT_COLORS, borderRadius: 5, padding: 10, alignItems: 'center' }} onPress={() => setDateOpen(false)}>
                          <Text>OK</Text>
                        </TouchableOpacity>
                      </Overlay>
                    ) : (
                      <DateTimePicker
                        testID="dateTimePicker"
                        mode="date"
                        value={date ? date : new Date()}
                        display="default"
                        // onSubmit={() => setDateOpen(false)}

                        // onSelectItem={() => setDateOpen(false)}
                        onChange={(event, date) => {
                          const formattedDate = moment(date).format('L');
                          setDate(date)
                          setDateOpen(false)
                          console.log("event", event)
                          if (event.type === "dismissed") onChange()
                          else onChange(formattedDate)
                        }}
                      />
                    )
                    )}
                  </View>
                )}
                name="date"
              />
            </View>
            <View style={tw("flex-col")}>
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.input}>
                    <TextInput
                      value={value}
                      onChangeText={() => onChange(startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))}
                      style={styles.textInput}
                      onPressIn={() => { setStartTimeOpen(true); setStartTime(new Date()); }}
                      placeholder="Start time...."
                      placeholderTextColor={theme.FONT_COLORS}
                    />
                    {startTimeOpen && (Platform.OS === 'ios' ? (
                      <Overlay
                        backdropStyle={{ flex: 1, padding: 5, backgroundColor: theme.PRIMARY_BACKGROUND, opacity: 0.8 }}
                        overlayStyle={{ backgroundColor: theme.PRIMARY_BACKGROUND_200, borderRadius: 10 }}
                        onBackdropPress={() => setStartTimeOpen(false)}
                      >
                        <DateTimePicker
                          testID="startTimePicker"
                          mode="time"
                          value={startTime ? startTime : new Date()}
                          minuteInterval={15}
                          display="spinner"
                          style={{ height: 300, width: 300, marginBottom: 4 }}
                          textColor={theme.FONT_COLORS}
                          onChange={(event, time) => {
                            // console.log("time: ", time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
                            // const formattedTime = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                            const formattedTime = moment(time).format('h:mm a')
                            console.log(formattedTime);
                            // setStartTime(time)
                            // setStartTimeOpen(false)
                            // onChange(formattedTime)
                            // if (event.type === "dismissed") onChange()
                            // else onChange(formattedTime)
                          }}
                        />
                        <TouchableOpacity style={{ backgroundColor: theme.FONT_COLORS, borderRadius: 5, padding: 10, alignItems: 'center' }} onPress={() => setStartTimeOpen(false)}>
                          <Text>OK</Text>
                        </TouchableOpacity>
                      </Overlay>

                    ) : (
                      <DateTimePicker
                        testID="startTimePicker"
                        mode="time"
                        value={startTime ? startTime : new Date()}
                        minuteInterval={15}
                        display="default"
                        onSelectItem={() => setStartTimeOpen(false)}
                        onChange={(event, time) => {
                          const formattedTime = moment(time).format('h:mm a')
                          setStartTime(time)
                          setStartTimeFormatted(formattedTime);

                          // updates tasks expCompletion time relative to start time
                          if (tasks) {
                            let newTasks = tasks;
                            newTasks.map((task) => {
                              task.expCompletionTime = moment(formattedTime, 'h:mm a').add(task.relativeTime.hours, 'hours').add(task.relativeTime.min, 'minutes').format('h:mm a')
                            })
                            setTasks(newTasks);
                          }
                          setStartTimeOpen(false)
                          if (event.type === "dismissed") onChange()
                          else onChange(formattedTime)
                        }}
                      />
                    )
                    )}
                  </View>
                )}
                name="startTime"
              />
              <Controller
                control={control}
                rules={{}}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.input}>
                    <TextInput
                      value={value}
                      onChangeText={() => onChange(endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))}
                      style={styles.textInput}
                      onPressIn={() => { setEndTimeOpen(true); setEndTime(new Date()); }}
                      placeholder="End time...."
                      placeholderTextColor={theme.FONT_COLORS}
                    />
                    {endTimeOpen && (Platform.OS === 'ios' ? (
                      <Overlay
                        backdropStyle={{ flex: 1, padding: 5, backgroundColor: theme.PRIMARY_BACKGROUND, opacity: 0.8 }}
                        overlayStyle={{ backgroundColor: theme.PRIMARY_BACKGROUND_200, borderRadius: 10 }}
                        onBackdropPress={() => setStartTimeOpen(false)}
                      >
                        <DateTimePicker
                          testID="endTimePickerIOS"
                          mode="time"
                          value={endTime ? endTime : new Date()}
                          minuteInterval={15}
                          display="spinner"
                          style={{ height: 300, width: 300, marginBottom: 4 }}
                          textColor={theme.FONT_COLORS}
                          onChange={(event, time) => {
                            // console.log("time: ", time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
                            // const formattedTime = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                            const formattedTime = moment(time).format('h:mm a')
                            console.log(formattedTime);
                            setEndTime(time)
                            // setStartTimeOpen(false)
                            // onChange(formattedTime)
                            if (event.type === "dismissed") onChange()
                            else onChange(formattedTime)
                          }}
                        />
                        <TouchableOpacity style={{ backgroundColor: theme.FONT_COLORS, borderRadius: 5, padding: 10, alignItems: 'center' }} onPress={() => setEndTimeOpen(false)}>
                          <Text>OK</Text>
                        </TouchableOpacity>
                      </Overlay>

                    ) : (
                      <DateTimePicker
                        testID="endTimePickerANDROID"
                        mode="time"
                        value={endTime ? endTime : new Date()}
                        minuteInterval={15}
                        display="default"
                        onSelectItem={() => setEndTimeOpen(false)}
                        onChange={(event, time) => {
                          // console.log("time: ", time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
                          // const formattedTime = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                          const formattedTime = moment(time).format('h:mm a')
                          console.log(formattedTime);
                          setEndTime(time)
                          setEndTimeOpen(false)
                          // onChange(formattedTime)
                          if (event.type === "dismissed") onChange()
                          else onChange(formattedTime)
                        }}
                      />
                    )
                    )}
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

        {tasks && (
          <>
            <View style={tw("mb-2")}>
              <Text style={[tw("text-lg"), { color: theme.FONT_COLORS }]}>Tasks</Text>
            </View>
            <View style={tw("mb-8")}>
              {tasks.map((task, index) => (
                <TaskCard key={index} task={task} />
              )
              )}
            </View>
          </>
        )}
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
                placeholder='Select...'
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
          <Text style={[tw("text-center"), styles.buttonText]}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddEvent

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
