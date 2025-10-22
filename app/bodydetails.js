import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from './contexts/UserDataContext';

const { width } = Dimensions.get('window');

const BodyDetails = () => {
  const router = useRouter();
  const { userData, updateWeight } = useUserData();
  const [weight, setWeight] = useState(userData.weight); // Start with context data
  const [unit, setUnit] = useState(userData.weightUnit);
  const scrollViewRef = useRef(null);
  const didInitialScroll = useRef(false);

  const minWeight = unit === 'kg' ? 30 : 66;
  const maxWeight = unit === 'kg' ? 200 : 440;

  const convertWeight = (value, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return value;
    if (fromUnit === 'kg' && toUnit === 'lbs') return Math.round(value * 2.20462);
    if (fromUnit === 'lbs' && toUnit === 'kg') return Math.round(value / 2.20462);
    return value;
  };

  const handleUnitChange = (newUnit) => {
    if (newUnit !== unit) {
      const convertedWeight = convertWeight(weight, unit, newUnit);
      setWeight(convertedWeight);
      setUnit(newUnit);
      // Update context with new unit and converted weight
      updateWeight(convertedWeight, newUnit);
    }
  };

  const isFormValid = !!weight;

  const renderWeightScale = () => {
    const scales = [];
    const totalItems = maxWeight - minWeight;

    // Add scale items without any spacers
    for (let i = 0; i <= totalItems; i++) {
      const weightValue = i + minWeight;
      const isMainScale = weightValue % 10 === 0;

      scales.push(
        <View key={weightValue} style={styles.scaleItem}>
          {isMainScale && <Text style={styles.scaleText}>{weightValue}</Text>}
          <View style={[styles.scaleLine, isMainScale && styles.mainScaleLine]} />
        </View>
      );
    }

    return scales;
  };

  useEffect(() => {
    if (scrollViewRef.current && !didInitialScroll.current) {
      const itemWidth = 20;
      const containerWidth = width * 0.9; // full width of weight box
      const indicatorOffset = 10; // same as scaleIndicator left
      const initialIndex = weight - minWeight;
      const offset = (initialIndex * itemWidth) - (containerWidth / 2 - indicatorOffset);
      scrollViewRef.current.scrollTo({ x: Math.max(0, offset), animated: false });
      didInitialScroll.current = true; // only do this once!
    }
  }, [unit]); // Only trigger on unit change, not weight change

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
              What is your <Text style={styles.goal}>weight?</Text>
            </Text>

            {/* Unit Toggle */}
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
                onPress={() => handleUnitChange('kg')}
              >
                <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>kg</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'lbs' && styles.unitButtonActive]}
                onPress={() => handleUnitChange('lbs')}
              >
                <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>lbs</Text>
              </TouchableOpacity>
            </View>

            {/* Weight Display */}
            <View style={styles.weightContainer}>
              <Text style={styles.weightValue}>{weight}</Text>
              <Text style={styles.weightUnit}>{unit}</Text>

              <View style={styles.scaleContainer}>
                <View style={styles.scaleIndicator} />
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scaleScrollContainer}
                  onScroll={(event) => {
                    const scrollX = event.nativeEvent.contentOffset.x;
                    const itemWidth = 20;
                    const containerWidth = width * 0.9;
                    const scrollIndex = Math.round((scrollX + (containerWidth / 2 - 9)) / itemWidth);
                    const newWeight = scrollIndex + minWeight - 8; // Subtract 8 to fix the offset

                    if (
                      newWeight !== weight &&
                      newWeight >= minWeight &&
                      newWeight <= maxWeight
                    ) {
                      setWeight(newWeight);
                      // Update context in real-time
                      updateWeight(newWeight, unit);
                    }
                  }}
                  scrollEventThrottle={16}
                >
                  {renderWeightScale()}
                </ScrollView>
              </View>
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !isFormValid && styles.disabledButton]}
            disabled={!isFormValid}
            onPress={() => router.push('/height')}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BodyDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    paddingVertical: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    width: '66.6%',
    backgroundColor: '#07da63',
    borderRadius: 2,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  goal: {
    color: '#07da63',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
    marginBottom: 40,
  },
  unitButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unitButtonActive: {
    backgroundColor: '#FFD700',
  },
  unitText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  unitTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  weightContainer: {
    backgroundColor: '#F5F5DC',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    width: '90%',
    minHeight: 200,
    justifyContent: 'center',
  },
  weightValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  weightUnit: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  scaleContainer: {
    width: '100%',
    height: 80,
    position: 'relative',
    marginTop: 20,
  },
  scaleScrollContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  scaleItem: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scaleLine: {
    width: 1,
    height: 20,
    backgroundColor: '#999',
    marginTop: 5,
  },
  mainScaleLine: {
    height: 25,
    width: 2,
    backgroundColor: '#666',
  },
  scaleText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  scaleIndicator: {
    position: 'absolute',
    top: 0,
    left: 9,
    width: 2,
    height: 30,
    backgroundColor: '#07da63',
    zIndex: 10,
  },
  spacer: {
    height: 20,
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
});
