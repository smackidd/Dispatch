import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Switch } from 'react-native-elements'
import tw from "tailwind-rn";
import theme from "../../styles/theme.style";

const EditTask = ({ task }) => {
  const [alertValue, setAlertValue] = useState(task.isAlert);
  const [managerAlertValue, setManagerAlertValue] = useState(task.isManagerAlert);

  return (
    <>
      <View style={tw("flex-1 flex-row")}>
        <View style={tw("flex-1 mr-4")}>
          <View style={styles.input}>
            <TextInput
              // value={value}
              // onChangeText={}
              style={styles.textInput}
              placeholder="Task name..."
              placeholderTextColor={theme.FONT_COLORS}
            />
          </View>
          <View style={tw("flex-row")}>
            <View style={styles.input}>
              <TextInput
                // value={value}
                // onChangeText={}
                style={styles.textInput}
                placeholder="Hour offset..."
                placeholderTextColor={theme.FONT_COLORS}
              />
            </View>
            <View style={styles.input}>
              <TextInput
                // value={value}
                // onChangeText={}
                style={styles.textInput}
                placeholder="Minutes..."
                placeholderTextColor={theme.FONT_COLORS}
              />
            </View>
          </View>
        </View>
        <View>
          <View style={styles.alerts}>
            <Text style={{ color: theme.FONT_COLORS }}>Alert</Text>
            <Switch color={theme.ACCENT_COLOR} value={alertValue} onChange={(value) => setAlertValue(value)} />
          </View>
          {/* <View style={styles.alerts}>
            <Text style={{ color: theme.FONT_COLORS }}>Org Alert</Text>
            <Switch />
          </View> */}
          <View style={styles.alerts}>
            <Text style={{ color: theme.FONT_COLORS }}>Manager Alert</Text>
            <Switch color={theme.ACCENT_COLOR} value={managerAlertValue} onChange={(value) => setManagerAlertValue(value)} />
          </View>
        </View>
      </View>
      <View style={tw("flex-row mb-4")}>

        <TouchableOpacity style={[tw("flex-1"), styles.button, styles.submitButton]}>
          <Text style={[styles.buttonText, styles.submitText]} >Update Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[tw(""), styles.button, styles.cancelButton]} >
          <Text style={[styles.buttonText, styles.cancelText]} >Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default EditTask;

const styles = StyleSheet.create({
  alerts: {
    paddingBottom: 20,
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
  button: {

    paddingVertical: 6,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: theme.ACCENT_COLOR,
    marginRight: 8,
  },
  cancelButton: {
    width: '33%',
    backgroundColor: theme.PRIMARY_BACKGROUND,
    borderWidth: 1,
    borderColor: theme.FONT_COLORS
  },
  buttonText: {
    textAlign: 'center'
  },
  submitText: {
    color: theme.PRIMARY_BACKGROUND
  },
  cancelText: {
    color: theme.FONT_COLORS
  }
})