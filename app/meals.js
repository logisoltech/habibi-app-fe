import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserData } from './contexts/UserDataContext';

const Meals = () => {
  const router = useRouter();
  const { updateMealCount, updateMealTypes } = useUserData();

  const preferenceOptions = [
    { label: 'Breakfast 🥞', value: 'breakfast', required: false },
    { label: 'Lunch 🍱', value: 'lunch', required: true },
    { label: 'Snacks 🍙', value: 'snacks', required: false },
    { label: 'Dinner 🍔', value: 'dinner', required: true },
  ];

  const [selectedMeals, setSelectedMeals] = useState(['lunch', 'dinner']); // Pre-select lunch and dinner

  const isFormValid = selectedMeals.length >= 2; // At least 2 meals (lunch and dinner are required)

  const handleMealToggle = (mealValue) => {
    const option = preferenceOptions.find(opt => opt.value === mealValue);
    
    // Don't allow unselecting required meals (lunch and dinner)
    if (option.required) {
      return;
    }
    
    setSelectedMeals(prev => {
      if (prev.includes(mealValue)) {
        // Don't allow unselecting if it would leave less than 2 meals
        if (prev.length <= 2) {
          return prev;
        }
        return prev.filter(meal => meal !== mealValue);
      } else {
        return [...prev, mealValue];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.heading}>
            How Many Meals Do You <Text style={styles.goal}>Prefer To Eat?</Text>
          </Text>
          
          <Text style={styles.note}>
            Lunch and Dinner are required (pre-selected). You can also add Breakfast and Snacks by tapping them.
          </Text>

          {preferenceOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                (selectedMeals.includes(item.value) || item.required) && styles.selectedButton,
              ]}
              onPress={() => handleMealToggle(item.value)}
              disabled={item.required} // Disable required meals
            >
              <Text
                style={[
                  styles.optionText,
                  (selectedMeals.includes(item.value) || item.required) && styles.selectedText,
                ]}
              >
                {item.label} {item.required && '(Required)'}
              </Text>
            </TouchableOpacity>
          ))}

        </ScrollView>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, !isFormValid && styles.disabledButton]}
            disabled={!isFormValid}
            onPress={() => {
              updateMealCount(selectedMeals.length);
              updateMealTypes(selectedMeals);
              router.push('/howmany');
            }}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Meals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
    marginTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    width: '96%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginVertical: 8,
    alignSelf: 'center',
  },
  optionText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#07da63',
    borderColor: '#07da63',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#07da63',
    padding: 14,
    borderRadius: 100,
  },
  disabledButton: {
    backgroundColor: '#c9f2d7',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goal: {
    color: '#07da63',
  },
});