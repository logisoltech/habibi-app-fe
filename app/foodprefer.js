import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserData } from './contexts/UserDataContext';

const FoodPrefer = () => {
  const router = useRouter();
  const { updatePlan, getBMIInfo } = useUserData();

  // Get user's BMI information
  const bmiInfo = getBMIInfo();
  const currentBMI = bmiInfo.bmi;

  // Get recommended dietary plans based on BMI
  const getRecommendedPlans = () => {
    // Always use green color
    if (currentBMI < 18.5) {
      // Underweight - Need to gain weight
      return {
        category: 'Underweight',
        icon: '💪',
        message: 'We recommend high-protein and balanced meals to help you gain healthy weight.',
        plans: ['Protein Boost', 'Balanced'],
        color: '#07da63',
      };
    } else if (currentBMI >= 18.5 && currentBMI < 25) {
      // Normal weight - Maintain
      return {
        category: 'Healthy Range',
        icon: '✨',
        message: 'Your BMI is perfect! Choose any plan that fits your lifestyle and preferences.',
        plans: ['Balanced', "Chef's Choice", 'Vegetarian Kitchen'],
        color: '#07da63',
      };
    } else if (currentBMI >= 25 && currentBMI < 30) {
      // Overweight - Lose weight
      return {
        category: 'Overweight',
        icon: '🎯',
        message: 'We recommend low-carb or keto plans to help you achieve your weight loss goals.',
        plans: ['Low Carb', 'Keto'],
        color: '#07da63',
      };
    } else {
      // Obese - Lose weight
      return {
        category: 'Obese',
        icon: '🔥',
        message: 'Low-carb and keto plans can help kickstart your weight loss journey effectively.',
        plans: ['Low Carb', 'Keto'],
        color: '#07da63',
      };
    }
  };

  const recommendation = getRecommendedPlans();

  const preferenceOptions = [
    { 
      label: 'Balanced', 
      value: 'Balanced',
      description: 'Balanced in proteins, carbs and fats.',
      color: '#7293dd'
    },
    { 
      label: 'Low Carb', 
      value: 'Low Carb',
      description: 'Low in carbs, more fats.',
      color: '#f0ad19'
    },
    { 
      label: 'Protein Boost', 
      value: 'Protein Boost',
      description: 'High in protein, moderate low in fats and carbs.',
      color: '#e96250'
    },
    { 
      label: 'Vegetarian Kitchen', 
      value: 'Vegetarian Kitchen',
      description: 'All organic and pure vegetarian.',
      color: '#5abe17'
    },
    { 
      label: "Chef's Choice", 
      value: "Chef's Choice",
      description: 'Curated specials of the day.',
      color: '#8d79e9'
    },
    { 
      label: 'Keto', 
      value: 'Keto',
      description: 'Healthy fats and low carbs to enhance ketosis and burn fat.',
      color: '#7293dd'
    },
  ];

  const [selectedPreference, setSelectedPreference] = useState(null);

  const selectPreference = (value) => {
    setSelectedPreference(value);
    // Save selected plan to context
    updatePlan(value);
    // Navigate immediately after selection
    setTimeout(() => {
      router.push('/tdee');
    }, 200); // Small delay to show selection feedback
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.heading}>
            Select Your <Text style={styles.goal}>Dietary Plan</Text>
          </Text>

          {/* BMI-based Recommendation Card */}
          <View style={styles.recommendationCard}>
            <View style={[styles.cardColoredHeader, { backgroundColor: recommendation.color }]}>
              <Text style={styles.iconEmoji}>{recommendation.icon}</Text>
              <View style={styles.bmiInfoContainer}>
                <Text style={styles.bmiLabelWhite}>Your BMI</Text>
                <Text style={styles.bmiValueWhite}>{currentBMI}</Text>
                <Text style={styles.bmiCategoryWhite}>{recommendation.category}</Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.recommendationMessage}>{recommendation.message}</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.recommendedLabel}>✓ Recommended Plans:</Text>
              <View style={styles.recommendedPlansRow}>
                {recommendation.plans.map((plan, index) => (
                  <View key={index} style={styles.recommendedPlanTag}>
                    <Text style={styles.recommendedPlanText}>{plan}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.selectLabel}>Choose Your Plan:</Text>

          {preferenceOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { backgroundColor: item.color },
                selectedPreference === item.value && styles.selectedButton,
              ]}
              onPress={() => selectPreference(item.value)}
            >
              <View style={styles.cardContent}>
                <Text style={styles.optionTitle}>{item.label}</Text>
                <Text style={styles.optionDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FoodPrefer;

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
    marginBottom: 24,
    textAlign: 'left',
  },
  recommendationCard: {
    width: '100%',
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cardColoredHeader: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  bmiInfoContainer: {
    alignItems: 'center',
  },
  bmiLabelWhite: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  bmiValueWhite: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bmiCategoryWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.95,
  },
  cardContent: {
    padding: 20,
    backgroundColor: '#fff',
  },
  recommendationMessage: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 0,
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginBottom: 10,
  },
  recommendedLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#07da63',
    marginBottom: 8,
    marginTop: 2,
    textAlign: 'center',
    paddingLeft: 10,
  },
  recommendedPlansRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  recommendedPlanTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: '#e8f8f0',
    borderWidth: 1.5,
    borderColor: '#07da63',
  },
  recommendedPlanText: {
    color: '#07da63',
    fontSize: 13,
    fontWeight: '700',
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionButton: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 6,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  optionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 18,
  },
  selectedButton: {
    borderWidth: 3,
    borderColor: '#07da63',
    transform: [{ scale: 0.98 }],
  },
  goal: {
    color: '#07da63',
  },
});
