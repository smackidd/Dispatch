import { addDoc, collection, doc, getDoc, getDocs, query, QueryDocumentSnapshot, serverTimestamp, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Controller, set, useForm } from 'react-hook-form';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import tw from "tailwind-rn";
import { db } from '../Firebase';
import theme from "../styles/theme.style";
import { ListItem, Avatar } from "react-native-elements";
import useAuth from '../hooks/useAuth';
import generateId from '../lib/generateIds';
import { useNavigation } from '@react-navigation/native';


/////
//
// Todo:
// -add autoComplete functionality
//
/////

const AddContact = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [emailInput, setEmailInput] = useState(null);
  const [emailList, setEmailList] = useState([]);
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
    }
  })


  // useEffect(() => {
  //   let unsub;

  //   const fetchEmails = async () => {
  //     const searchText = watch(["email"])[0];
  //     const docSnap = await getDoc(query(doc(db, 'users'), where("email", "==", searchText.toLowerCase())))
  //       .catch(error => alert(error.message));
  //     unsub = docSnap
  //     setEmailList({ email: docSnap.data().email, displayName: docSnap.data().displayName, role: docSnap.data().role })
  //     console.log(emailList.email);
  //   }
  //   fetchEmails();
  //   console.log(watch(["email"])[0])
  //   return unsub;
  // }, [watch()]);

  /////
  //This function handles the onsubmit of the email search form
  /////
  onSubmit = async (data) => {
    const { email } = data;
    setEmailList([]);
    ////
    // Must check if data.email is user
    ///
    const docRef = collection(db, 'users');
    const queryRef = query(docRef, where("email", "==", email.toLowerCase()));
    const docSnap = await getDocs(queryRef)
      .then((data) => {
        if (data.size > 0) {
          data.forEach((doc) => {
            setEmailList([...emailList, { id: doc.data().id, email: doc.data().email, displayName: doc.data().displayName, role: doc.data().role, photoURL: doc.data().photoURL }])
          })
        } else {
          alert("Email does not exist")
        }

      })
      .catch(error => alert(error.message));
  }

  /////
  //This function handles the selecting of the email ListItem
  /////
  const onSelect = async (data) => {
    console.log(data);
    console.log(user);
    ////
    // Must check if connection has already been made
    ////
    if (data.role == "Manager" && user.role == 'Manager') {
      alert("Connections can only be made between Managers and either Freelancers or Organizations")
    } else {
      if (data.role == 'Manager' || user.role == 'Manager') {
        const message = `${user.displayName} (${user.role}) wants to connect with you. Swipe to accept.`
        const type = 'connection';
        const contactId = generateId(data.id, user.uid)

        await addDoc(collection(db, 'users', data.id, 'alerts'), {
          timestamp: serverTimestamp(),
          alertType: type,
          message: message,
          isViewed: false,
          contactId: contactId,
          usersMatched: [data.id, user.uid],
        })
        await setDoc(doc(db, 'contacts', contactId), {
          users: {
            [data.id]: data,
            [user.uid]: {
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL ? user.photoURL : null,
              role: user.role
            }
          },
          usersMatched: [data.id, user.uid],
          isConfirmed: false,
          timestamp: serverTimestamp()
        })

        navigation.goBack();
      } else {
        alert("Connections can only be made between Managers and either Freelancers or Organizations")
      }
    }

  }

  return (
    <View style={[tw("flex-1 p-8"), { backgroundColor: theme.PRIMARY_BACKGROUND }]}>
      <View style={tw("items-center mt-5")}>
        <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>Add a Connection</Text>
        <Text style={[tw(""), { color: theme.FONT_COLORS }]}>Find an Organization or Freelancer</Text>
      </View>
      {/* <ScrollView style={tw("mb-16")}> */}
      <View style={tw("flex-row")}>
        <Controller
          control={control}
          rules={{}}
          render={({ field: { onChange, value } }) => (
            <View style={styles.input}>
              <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>Search by email</Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                // onBlur={onBlur}
                style={styles.textInput}
              />
            </View>
          )}
          name="email"
        />
      </View>
      {errors.email && <Text style={{ color: theme.ALERT_OFF, marginBottom: 4 }}>Display Name is required.</Text>}
      <View style={tw("mb-8")}>
        <TouchableOpacity
          style={[styles.buttonStyle]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[tw("text-center"), styles.buttonText]}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* EMAIL LIST */}
      {emailList.length > 0 && (
        <FlatList
          keyExtractor={(item, index) => "1"}
          data={emailList}

          renderItem={({ item }) => (
            <TouchableOpacity onPress={(e) => onSelect(item)}>
              <ListItem containerStyle={styles.list}>
                <Avatar title={item.displayName} rounded source={item.photoURL ? { uri: item.photoURL } : {}} />
                <ListItem.Content>
                  <ListItem.Title style={styles.dropdownText}>{item.displayName}</ListItem.Title>
                  <ListItem.Subtitle style={styles.dropdownText}>{item.email}</ListItem.Subtitle>
                  <ListItem.Subtitle style={styles.dropdownText}>{item.role}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </TouchableOpacity>
          )
          }
        />
      )}
      {/* </ScrollView> */}
    </View>
  )
}

export default AddContact

const styles = StyleSheet.create({
  list: {
    backgroundColor: theme.PRIMARY_BACKGROUND,
    borderWidth: 0.5,
    borderColor: theme.PRIMARY_BACKGROUND_200,
    borderRadius: 5,
    color: theme.FONT_COLORS,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.33,
    shadowRadius: 1.33,
    elevation: 2,
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
