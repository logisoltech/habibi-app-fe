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
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from './contexts/UserDataContext';

const DetailForm = () => {
  const router = useRouter();
  const { updateGoal } = useUserData();
  const [selectedGoal, setSelectedGoal] = useState(null);

  const goalOptions = [
    'Weight Gain',
    'Weight Loss', 
    'Staying Fit',
    'Eating Healthy',
    'Keto Diet',
  ];

  const isFormValid = selectedGoal !== null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.contentContainer}>
            <Text style={styles.heading}>
              What do you want to <Text style={styles.goal}>achieve?</Text>
            </Text>
            <Text style={styles.subtitle}>
              What you are going to select will effect your diet plan!
            </Text>

            {goalOptions.map((goal, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedGoal === goal && styles.selectedButton,
                ]}
                onPress={() => setSelectedGoal(goal)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedGoal === goal && styles.selectedText,
                  ]}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.nextButton, !isFormValid && styles.disabledButton]}
            disabled={!isFormValid}
            onPress={() => {
              updateGoal(selectedGoal);
              router.push('/bodydetails');
            }}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DetailForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressBar: {

    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    width: '100%', // Adjust based on step
    backgroundColor: '#07da63',
    borderRadius: 2,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 120, // Space for bottom navigation
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 20,
  },
  optionButton: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 100, // Fully rounded
    marginVertical: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center', // Centered text
    fontWeight: '500',
  },
  selectedButton: {
    backgroundColor: '#07da63',
    borderColor: '#07da63',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#07da63',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#c9f2d7',
  },
  nextText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  goal: {
    color: '#07da63',
  },
});
