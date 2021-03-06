import React, { useEffect, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { View, Text, StyleSheet, TextInput, Picker, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import theme from '../styles/theme.style.js';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from "react-hook-form";
import SelectDropdown from 'react-native-select-dropdown';

const dropdownData = [
  "Organization", "Manager", "Freelancer"
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const InitAccountInfo = () => {
  const { user, updateProfile, logout } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState('');

  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      displayName: user.displayName,
      role: ''
    }
  })

  // this method initializes push notifications and requests the user for permission to push notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // // This listener is fired whenever a notification is received while the app is foregrounded
    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });

    // // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
    // });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const onSubmit = (data) => {
    const { displayName, role } = data;
    {/* update the profile in the useAuth hook */ }
    updateProfile(displayName, role, user.photoURL, expoPushToken);

    {/* update the database */ }
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      email: user.email,
      displayName: displayName,
      role: role,
      photoURL: user.photoURL ? user.photoURL : null,
      unreadMessages: 0,
      expoPushToken: expoPushToken,
      timestamp: serverTimestamp(),
    })
      .then((data) => {

        navigation.navigate("Dispatch", {
          displayName, role, photoURL: user.photoURL
        });
      })
      .catch((error) => {
        alert(error.message);
      });

    //setNameValue(data.displayName)
    console.log(displayName);

  };




  return (
    <View style={[tw("flex-1 p-8"), { backgroundColor: theme.PRIMARY_BACKGROUND }]}>
      <View style={tw("items-center mt-5")}>
        <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>Welcome, {user.displayName}</Text>
        <Text style={[tw(""), { color: theme.FONT_COLORS }]}>Please update your info</Text>
      </View>
      <ScrollView style={tw("mb-16")}>

        <View style={tw("flex-row")}>
          <Controller
            control={control}
            rules={{ required: true, minLength: 4, maxLength: 50 }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>Display name (Company)</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  // onBlur={onBlur}
                  style={styles.textInput}
                />
              </View>
            )}
            name="displayName"
          />
        </View>
        {errors.displayName && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Display Name is required.</Text>}

        <View style={tw("flex-row")}>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <View style={styles.input}>
                <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>Select a Role</Text>
                <SelectDropdown
                  data={dropdownData}
                  onSelect={(itemValue, itemIndex) => onChange(itemValue)}
                  buttonTextAfterSelection={(selectItem) => selectItem}
                  buttonStyle={styles.dropdown}
                  buttonTextStyle={styles.dropdownText}
                />

              </View>
            )}
            name="role"
          />
        </View>
        {errors.role && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Role is required.</Text>}


        {/* <View style={tw("flex-row")}>
          <View style={styles.input}>
            <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>First Name</Text>
            <TextInput
              value={nameValue}
              onChangeText={text => setFirstNameValue(text)}
              style={styles.textInput}
            />
          </View>
          <View style={styles.input}>
            <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>Last Name</Text>
            <TextInput
              value={nameValue}
              onChangeText={text => setLasttNameValue(text)}
              style={styles.textInput}
            />
          </View>
        </View>
        <View style={tw("flex-row")}>
          <View style={styles.input}>
            <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>Phone</Text>
            <TextInput
              value={nameValue}
              onChangeText={text => setPhoneValue(text)}
              style={styles.textInput}
            />
          </View>
          <View style={styles.input}>
            <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>Email</Text>
            <TextInput
              value={nameValue}
              onChangeText={text => setEmailValue(text)}
              style={styles.textInput}
            />
          </View>
        </View> */}

        <TouchableOpacity
          style={[styles.buttonStyle]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[tw("text-center"), styles.buttonText]}>Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonStyle]}
          onPress={logout}
        >
          <Text style={[tw("text-center"), styles.buttonText]}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>

  )
}

export default InitAccountInfo;

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
    marginLeft: 8,
    marginBottom: 16,
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
    marginRight: 8,
    marginBottom: 16,
    padding: 16,
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
