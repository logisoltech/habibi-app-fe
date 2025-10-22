import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from './contexts/UserDataContext';

const { width } = Dimensions.get('window');

const BMICalculator = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userData, getBMIInfo } = useUserData();
  
  // Check if user came from home page
  const fromHome = params.fromHome === 'true';
  
  // Age and Gender states
  const [age, setAge] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);
  
  // Weight states
  const [weight, setWeight] = useState(70);
  const [weightUnit, setWeightUnit] = useState('kg');
  const weightScrollViewRef = useRef(null);
  const weightDidInitialScroll = useRef(false);
  
  // Height states
  const [height, setHeight] = useState(170);
  const [heightUnit, setHeightUnit] = useState('cm');
  const heightScrollViewRef = useRef(null);
  const heightDidInitialScroll = useRef(false);

  // Weight conversion and limits
  const minWeight = weightUnit === 'kg' ? 30 : 66;
  const maxWeight = weightUnit === 'kg' ? 200 : 440;

  const convertWeight = (value, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return value;
    if (fromUnit === 'kg' && toUnit === 'lbs') return Math.round(value * 2.20462);
    if (fromUnit === 'lbs' && toUnit === 'kg') return Math.round(value / 2.20462);
    return value;
  };

  const handleWeightUnitChange = (newUnit) => {
    if (newUnit !== weightUnit) {
      const convertedWeight = convertWeight(weight, weightUnit, newUnit);
      setWeight(convertedWeight);
      setWeightUnit(newUnit);
    }
  };

  // Height conversion and limits
  const minHeight = heightUnit === 'cm' ? 100 : 39;
  const maxHeight = heightUnit === 'cm' ? 250 : 98;

  const convertHeight = (value, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return value;
    if (fromUnit === 'cm' && toUnit === 'inches') return Math.round(value / 2.54);
    if (fromUnit === 'inches' && toUnit === 'cm') return Math.round(value * 2.54);
    return value;
  };

  const handleHeightUnitChange = (newUnit) => {
    if (newUnit !== heightUnit) {
      const convertedHeight = convertHeight(height, heightUnit, newUnit);
      setHeight(convertedHeight);
      setHeightUnit(newUnit);
    }
  };

  // Get BMI data from context (uses actual user weight and height data)
  const bmiInfo = getBMIInfo();
  const currentBMI = bmiInfo.bmi;

  // Calculate BMI position on the scale (0-100%)
  const getBMIPosition = (bmi) => {
    const scaleWidth = width - 40; // Account for padding
    let position;
    
    if (bmi < 18.5) {
      // Underweight: 0-25% of scale
      position = (bmi / 18.5) * 0.25;
    } else if (bmi < 25) {
      // Normal: 25-50% of scale
      position = 0.25 + ((bmi - 18.5) / (25 - 18.5)) * 0.25;
    } else if (bmi < 30) {
      // Overweight: 50-75% of scale
      position = 0.5 + ((bmi - 25) / (30 - 25)) * 0.25;
    } else {
      // Obese: 75-100% of scale
      position = 0.75 + Math.min(((bmi - 30) / 10) * 0.25, 0.25);
    }
    
    return `${Math.max(5, Math.min(95, position * 100))}%`;
  };

  // Weight scale rendering
  const renderWeightScale = () => {
    const scales = [];
    const totalItems = maxWeight - minWeight;

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

  // Height scale rendering
  const renderHeightScale = () => {
    const scales = [];
    const totalItems = maxHeight - minHeight;

    for (let i = 0; i <= totalItems; i++) {
      const heightValue = i + minHeight;
      const isMainScale = heightValue % 10 === 0;

      scales.push(
        <View key={heightValue} style={styles.scaleItem}>
          {isMainScale && <Text style={styles.scaleText}>{heightValue}</Text>}
          <View style={[styles.scaleLine, isMainScale && styles.mainScaleLine]} />
        </View>
      );
    }

    return scales;
  };

  // Initial scroll setup for weight
  useEffect(() => {
    if (weightScrollViewRef.current && !weightDidInitialScroll.current) {
      const itemWidth = 20;
      const containerWidth = width * 0.9;
      const indicatorOffset = 10;
      const initialIndex = weight - minWeight;
      const offset = (initialIndex * itemWidth) - (containerWidth / 2 - indicatorOffset);
      weightScrollViewRef.current.scrollTo({ x: Math.max(0, offset), animated: false });
      weightDidInitialScroll.current = true;
    }
  }, [weightUnit]);

  // Initial scroll setup for height
  useEffect(() => {
    if (heightScrollViewRef.current && !heightDidInitialScroll.current) {
      const itemWidth = 20;
      const containerWidth = width * 0.9;
      const indicatorOffset = 9;
      const initialIndex = height - minHeight;
      const offset = (initialIndex * itemWidth) - (containerWidth / 2 - indicatorOffset);
      heightScrollViewRef.current.scrollTo({ x: Math.max(0, offset), animated: false });
      heightDidInitialScroll.current = true;
    }
  }, [heightUnit]);

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
          <View style={styles.bmiContainer}>
            <Text style={styles.phoneheading}>
              <Text style={styles.signin}>We Have Calculated Your</Text> BMI
            </Text>
            
            <View style={styles.bmiDisplay}>
              <Text style={styles.bmiValue}>{currentBMI}</Text>
              <Text style={[styles.bmiCategory, { color: '#fff' }]}>
                {bmiInfo.category}
              </Text>
            </View>

            {/* BMI Scale */}
            <View style={styles.bmiScale}>
              <View style={styles.scaleContainer}>
                {/* Scale segments */}
                <View style={styles.scaleSegments}>
                  <View style={[styles.segment, styles.underweightSegment]}>
                    <Text style={styles.segmentLabel}>Underweight</Text>
                    <Text style={styles.segmentRange}>{"<18.5"}</Text>
                  </View>
                  <View style={[styles.segment, styles.normalSegment]}>
                    <Text style={styles.segmentLabel}>Normal</Text>
                    <Text style={styles.segmentRange}>18.5-24.9</Text>
                  </View>
                  <View style={[styles.segment, styles.overweightSegment]}>
                    <Text style={styles.segmentLabel}>Overweight</Text>
                    <Text style={styles.segmentRange}>25-29.9</Text>
                  </View>
                  <View style={[styles.segment, styles.obeseSegment]}>
                    <Text style={styles.segmentLabel}>Obese</Text>
                    <Text style={styles.segmentRange}>{"≥30"}</Text>
                  </View>
                </View>
                
                {/* BMI Indicator */}
                <View style={[styles.bmiIndicator, { left: getBMIPosition(currentBMI) }]}>
                  <View style={styles.indicatorArrow} />
                  <Text style={styles.indicatorText}>BMI = {currentBMI}</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.bmiDescription}>
              Your BMI is {currentBMI}, which falls within the {bmiInfo.category.toLowerCase()} range.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Button - Only show if not from home page */}
        {!fromHome && (
          <View style={styles.bottomNavigation}>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={() => router.push('/foodprefer')}
            >
              <Text style={styles.proceedButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BMICalculator;


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
  bmiContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  phoneheading: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
    textAlign: 'center',
  },
  signin: {
    color: '#07da63',
  },
  bmiDisplay: {
    backgroundColor: '#07da63',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 30,
    minWidth: 200,
  },
  bmiValue: {
    color: '#fff',
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bmiCategory: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  bmiDescription: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  bmiScale: {
    marginVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
  },
  scaleContainer: {
    position: 'relative',
    height: 100,
    width: '100%',
  },
  scaleSegments: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  underweightSegment: {
    backgroundColor: '#3B82F6',
  },
  normalSegment: {
    backgroundColor: '#10B981',
  },
  overweightSegment: {
    backgroundColor: '#F59E0B',
  },
  obeseSegment: {
    backgroundColor: '#EF4444',
  },
  segmentLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  segmentRange: {
    color: '#fff',
    fontSize: 10,
    marginTop: 2,
  },
  bmiIndicator: {
    position: 'absolute',
    top: 55,
    alignItems: 'center',
    transform: [{ translateX: -30 }],
    width: 60,
  },
  indicatorArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
  },
  indicatorText: {
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
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
});
