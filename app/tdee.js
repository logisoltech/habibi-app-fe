import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from './contexts/UserDataContext';

const { width } = Dimensions.get('window');

const TDEECalculator = () => {
  const router = useRouter();
  const { userData, registerUser } = useUserData();
  const [registering, setRegistering] = useState(false);

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    // Convert weight to kg if needed
    let weightInKg = userData.weight;
    if (userData.weightUnit === 'lbs') {
      weightInKg = userData.weight / 2.20462;
    }

    // Convert height to cm if needed
    let heightInCm = userData.height;
    if (userData.heightUnit === 'inches') {
      heightInCm = userData.height * 2.54;
    }

    const age = userData.age || 25; // Default age if not set
    const gender = userData.gender || 'Male'; // Default gender if not set

    let bmr;
    if (gender.toLowerCase() === 'male') {
      // BMR for men: 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + 5
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
    } else {
      // BMR for women: 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) - 161
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
    }

    return Math.round(bmr);
  };

  // Get activity multiplier based on user's activity level
  const getActivityMultiplier = () => {
    const activity = userData.activity || 'Sedentary';
    
    const multipliers = {
      'Sedentary': 1.2,
      'Light': 1.375,
      'Moderate': 1.55,
      'Active': 1.725,
      'Very Active': 1.9,
    };

    return multipliers[activity] || 1.2;
  };

  // Get activity description
  const getActivityDescription = () => {
    const activity = userData.activity || 'Sedentary';
    
    const descriptions = {
      'Sedentary': 'Little or no exercise',
      'Light': 'Exercise 1-3 times per week',
      'Moderate': 'Exercise 3-5 times per week',
      'Active': 'Exercise 6-7 times per week',
      'Very Active': 'Very hard exercise daily or physical job',
    };

    return descriptions[activity] || 'Not specified';
  };

  // Calculate TDEE
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const multiplier = getActivityMultiplier();
    const tdee = bmr * multiplier;
    return Math.round(tdee);
  };

  const bmr = calculateBMR();
  const tdee = calculateTDEE();
  const activityMultiplier = getActivityMultiplier();
  
  // Calculate calorie goals for different objectives
  const maintenanceCalories = tdee;
  const cuttingCalories = Math.round(tdee * 0.8); // 20% deficit (Aggressive Cut)
  const bulkingCalories = Math.round(tdee * 1.15); // 15% surplus (Aggressive Bulk)
  const mildCuttingCalories = Math.round(tdee * 0.9); // 10% deficit
  const mildBulkingCalories = Math.round(tdee * 1.1); // 10% surplus

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
          <Text style={styles.backButton}> Go Back</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tdeeContainer}>
          <Text style={styles.heading}>
            <Text style={styles.highlight}>Your Total Daily</Text> Energy Expenditure
          </Text>
          
          {/* TDEE Display */}
          <View style={styles.tdeeDisplay}>
            <Text style={styles.tdeeValue}>{tdee}</Text>
            <Text style={styles.tdeeLabel}>calories/day</Text>
          </View>

          {/* Activity Level Info */}
          <View style={styles.activityInfo}>
            <View style={styles.activityRow}>
              <Ionicons name="fitness" size={20} color="#07da63" />
              <Text style={styles.activityText}>{userData.activity || 'Not specified'}</Text>
            </View>
            <Text style={styles.activityDescription}>{getActivityDescription()}</Text>
          </View>

          {/* BMR and TDEE Breakdown */}
          <View style={styles.breakdownSection}>
            <Text style={styles.sectionTitle}>Your Metabolism Breakdown</Text>
            
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Basal Metabolic Rate (BMR)</Text>
                <Text style={styles.breakdownValue}>{bmr} cal</Text>
              </View>
              <Text style={styles.breakdownDescription}>
                Calories burned at complete rest
              </Text>
            </View>

            <View style={styles.breakdownCard}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Activity Multiplier</Text>
                <Text style={styles.breakdownValue}>×{activityMultiplier}</Text>
              </View>
              <Text style={styles.breakdownDescription}>
                Based on your activity level
              </Text>
            </View>

            <View style={[styles.breakdownCard, styles.tdeeCard]}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Total Daily Energy</Text>
                <Text style={[styles.breakdownValue, styles.tdeeBreakdownValue]}>{tdee} cal</Text>
              </View>
              <Text style={styles.breakdownDescription}>
                Calories needed to maintain current weight
              </Text>
            </View>
          </View>

          {/* Calorie Goals Section */}
          <View style={styles.goalsSection}>
            <Text style={styles.sectionTitle}>Recommended Calorie Goals</Text>
            
            {/* Weight Loss */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Ionicons name="trending-down" size={24} color="#07da63" />
                <Text style={styles.goalTitle}>Weight Loss</Text>
              </View>
              
              <View style={styles.goalOption}>
                <Text style={styles.goalOptionTitle}>Aggressive Cut (20% deficit)</Text>
                <Text style={styles.goalCalories}>{cuttingCalories} cal/day</Text>
                <Text style={styles.goalExpected}>~0.9 kg per week</Text>
              </View>
              
              <View style={styles.goalDivider} />
              
              <View style={styles.goalOption}>
                <Text style={styles.goalOptionTitle}>Moderate Cut (10% deficit)</Text>
                <Text style={styles.goalCalories}>{mildCuttingCalories} cal/day</Text>
                <Text style={styles.goalExpected}>~0.45 kg per week</Text>
              </View>
            </View>

            {/* Maintenance */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Ionicons name="remove-circle" size={24} color="#07da63" />
                <Text style={styles.goalTitle}>Maintenance</Text>
              </View>
              
              <View style={styles.goalOption}>
                <Text style={styles.goalOptionTitle}>Maintain Current Weight</Text>
                <Text style={styles.goalCalories}>{maintenanceCalories} cal/day</Text>
                <Text style={styles.goalExpected}>No change expected</Text>
              </View>
            </View>

            {/* Weight Gain */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Ionicons name="trending-up" size={24} color="#07da63" />
                <Text style={styles.goalTitle}>Weight Gain</Text>
              </View>
              
              <View style={styles.goalOption}>
                <Text style={styles.goalOptionTitle}>Lean Bulk (10% surplus)</Text>
                <Text style={styles.goalCalories}>{mildBulkingCalories} cal/day</Text>
                <Text style={styles.goalExpected}>~0.45 kg per week</Text>
              </View>
              
              <View style={styles.goalDivider} />
              
              <View style={styles.goalOption}>
                <Text style={styles.goalOptionTitle}>Aggressive Bulk (15% surplus)</Text>
                <Text style={styles.goalCalories}>{bulkingCalories} cal/day</Text>
                <Text style={styles.goalExpected}>~0.7 kg per week</Text>
              </View>
            </View>
          </View>

          {/* Important Notes */}
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>📝 Important Notes</Text>
            <Text style={styles.noteText}>
              • These are estimates based on the Mifflin-St Jeor equation{'\n'}
              • Individual results may vary based on metabolism{'\n'}
              • Adjust calories based on your progress{'\n'}
              • Consult a healthcare provider for personalized advice
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.proceedButton, registering && styles.disabledButton]}
          disabled={registering}
          onPress={async () => {
            setRegistering(true);
            try {
              // TDEE will be automatically calculated in registerUser based on goal
              const result = await registerUser();
              if (result.success) {
                Alert.alert(
                  'Registration Successful!',
                  'Your account has been created successfully.',
                  [
                    {
                      text: 'Continue to Dashboard',
                      onPress: () => router.push('/home')
                    }
                  ]
                );
              } else {
                Alert.alert(
                  'Registration Failed',
                  result.error || 'Something went wrong. Please try again.',
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to register. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setRegistering(false);
            }
          }}
        >
          {registering ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.proceedButtonText}>Create Account & Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TDEECalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  tdeeContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 44,
  },
  highlight: {
    color: '#07da63',
  },
  tdeeDisplay: {
    backgroundColor: '#07da63',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  tdeeValue: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
  },
  tdeeLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 5,
  },
  activityInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 30,
  },
  breakdownSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tdeeCard: {
    backgroundColor: '#e8f8f0',
    borderColor: '#07da63',
    borderWidth: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07da63',
  },
  tdeeBreakdownValue: {
    fontSize: 20,
  },
  breakdownDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  goalsSection: {
    marginBottom: 30,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  goalOption: {
    paddingVertical: 8,
  },
  goalOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  goalCalories: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07da63',
    marginBottom: 4,
  },
  goalExpected: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
  goalDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  notesSection: {
    backgroundColor: '#fff8e1',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  proceedButton: {
    backgroundColor: '#07da63',
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#c9f2d7',
  },
});
