import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserData } from './contexts/UserDataContext';

const Allergies = () => {
  const router = useRouter();
  const { updateAllergies } = useUserData();

  const conditionOptions = ['Diabetes', 'Dairy', 'High Blood Pressure', 'Shellfish', 'Gluten', 'Eggs', 'Nuts', 'Soy'];
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [customCondition, setCustomCondition] = useState('');
  const [customAllergies, setCustomAllergies] = useState([]);

  const toggleCondition = (value) => {
    setSelectedConditions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const addCustomAllergy = () => {
    const trimmedCondition = customCondition.trim();
    if (trimmedCondition && !customAllergies.includes(trimmedCondition) && !selectedConditions.includes(trimmedCondition)) {
      setCustomAllergies((prev) => [...prev, trimmedCondition]);
      setCustomCondition('');
    }
  };

  const removeCustomAllergy = (allergyToRemove) => {
    setCustomAllergies((prev) => prev.filter((allergy) => allergy !== allergyToRemove));
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter') {
      addCustomAllergy();
    }
  };

  const isFormValid =
    selectedConditions.length > 0 || customAllergies.length > 0;

  const handleSubmit = () => {
    // Combine selected conditions and custom allergies into allergies array
    const allergies = [...selectedConditions, ...customAllergies];
    
    // Save allergies to context
    updateAllergies(allergies);
    
    // Navigate to BMI page
    router.push('/bmi');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.heading}>
            Allergies & <Text style={styles.goal}>Health Conditions</Text>
          </Text>

          {/* First Row: Diabetes & HIV */}
          <View style={styles.row}>
            {conditionOptions.slice(0, 2).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.halfButton,
                  selectedConditions.includes(item) && styles.selectedButton,
                ]}
                onPress={() => toggleCondition(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedConditions.includes(item) && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Second Row: High Blood Pressure */}
          <TouchableOpacity
            style={[
              styles.fullButton,
              selectedConditions.includes(conditionOptions[2]) &&
                styles.selectedButton,
            ]}
            onPress={() => toggleCondition(conditionOptions[2])}
          >
            <Text
              style={[
                styles.optionText,
                selectedConditions.includes(conditionOptions[2]) &&
                  styles.selectedText,
              ]}
            >
              {conditionOptions[2]}
            </Text>
          </TouchableOpacity>

          {/* Third Row: PCOS */}
          <TouchableOpacity
            style={[
              styles.fullButton,
              selectedConditions.includes(conditionOptions[3]) &&
                styles.selectedButton,
            ]}
            onPress={() => toggleCondition(conditionOptions[3])}
          >
            <Text
              style={[
                styles.optionText,
                selectedConditions.includes(conditionOptions[3]) &&
                  styles.selectedText,
              ]}
            >
              {conditionOptions[3]}
            </Text>
          </TouchableOpacity>
          <View style={styles.row}>
            {conditionOptions.slice(4, 6).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.halfButton,
                  selectedConditions.includes(item) && styles.selectedButton,
                ]}
                onPress={() => toggleCondition(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedConditions.includes(item) && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            {conditionOptions.slice(6, 8).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.halfButton,
                  selectedConditions.includes(item) && styles.selectedButton,
                ]}
                onPress={() => toggleCondition(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedConditions.includes(item) && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Condition Input */}
          <Text style={styles.label}>Add your own</Text>
          
          {/* Custom Allergies Chips */}
          {customAllergies.length > 0 && (
            <View style={styles.chipsContainer}>
              {customAllergies.map((allergy, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{allergy}</Text>
                  <TouchableOpacity
                    onPress={() => removeCustomAllergy(allergy)}
                    style={styles.chipRemove}
                  >
                    <Text style={styles.chipRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              value={customCondition}
              onChangeText={setCustomCondition}
              onKeyPress={handleKeyPress}
              placeholder="Type a condition or allergy and press Enter..."
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={addCustomAllergy}
            />
            {customCondition.trim().length > 0 && (
              <TouchableOpacity
                onPress={addCustomAllergy}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Allergies;

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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  goal: {
    color: '#07da63',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfButton: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
  },
  fullButton: {
    width: '96%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingVertical: 14,
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
  label: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#07da63',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 4,
  },
  chipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  chipRemove: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRemoveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#07da63',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
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
});
