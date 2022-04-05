import { View, Text, ScrollView, StyleSheet, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import theme from "../styles/theme.style";
import tw from "tailwind-rn";
import { Controller, useForm } from 'react-hook-form';
import TaskList from '../components/TaskList';
import TaskCard from '../components/TaskCards/TaskCard';

const EditTaskTemplate = () => {
  const { params } = useRoute();
  const { template } = params;
  const [tasks, setTasks] = useState(template.tasks);
  console.log('template name', template.name)
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: template.name,

    }
  })

  return (
    <View style={[tw("flex-1 p-8"), { backgroundColor: theme.PRIMARY_BACKGROUND }]}>
      <View style={tw("items-center mt-5")}>
        <Text style={[tw("text-xl font-bold"), { color: theme.FONT_COLORS }]}>Edit Task Template</Text>
      </View>
      <ScrollView style={tw("mb-16")}>
        <View style={tw("flex-row")}>
          <Controller
            control={control}
            rules={{ required: true, minLength: 4, maxLength: 50 }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <Text style={[tw("text-lg font-bold pt-2"), { color: theme.FONT_COLORS }]}>Template name</Text>
                <TextInput
                  value={value}
                  placeholder={template.name}
                  placeholderTextColor={theme.FONT_COLORS}
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

        <FlatList
          data={tasks}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TaskCard task={item} editable={true} />}
        />

      </ScrollView>
    </View>
  )
}

export default EditTaskTemplate;

const styles = StyleSheet.create({
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
})