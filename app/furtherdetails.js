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
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from './contexts/UserDataContext';

const FurtherDetails = () => {
  const router = useRouter();
  const { updatePersonalInfo, updatePhone, updateName, updateAddress, updateActivityLevel } = useUserData();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);
  const [address, setAddress] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [showActivityModal, setShowActivityModal] = useState(false);

  const activityLevels = [
    { value: 'Sedentary', label: 'Sedentary', description: 'little or no exercise' },
    { value: 'Light', label: 'Light', description: 'exercise 1-3 times/week' },
    { value: 'Moderate', label: 'Moderate', description: 'exercise 4-5 times/week' },
    { value: 'Active', label: 'Active', description: 'Daily Exercise' },
    { value: 'Very Active', label: 'Very Active', description: 'intense exercise 6-7 times/week' },
  ];

  const isFormValid = name.trim() !== '' && age.trim() !== '' && phone.trim() !== '' && selectedGender !== null && address.trim() !== '' && activityLevel !== null;

  const detectLocation = async () => {
    try {
      setIsDetectingLocation(true);
      
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to detect your address. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      // Use Expo Location's reverse geocoding
      const geocode = await Location.reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      });

      if (geocode.length > 0) {
        const addressData = geocode[0];
        const fullAddress = [
          addressData.streetNumber,
          addressData.street,
          addressData.district,
          addressData.subregion,
          addressData.city,
          addressData.region,
          addressData.postalCode,
          addressData.country,
        ].filter(Boolean).join(', ');
        
        setAddress(fullAddress);
        Alert.alert('✅ Success', 'Your address has been detected successfully!');
      } else {
        Alert.alert('❌ Error', 'Could not detect your location. Please enter your address manually.');
      }
    } catch (error) {
      Alert.alert(
        '❌ Location Detection Failed',
        `Error: ${error.message}\n\nPossible causes:\n• No internet connection\n• Location services disabled\n• App permissions denied\n\nPlease check your settings and try again, or enter your address manually.`,
        [
          { text: 'Try Again', onPress: () => detectLocation() },
          { text: 'Enter Manually', style: 'cancel' }
        ]
      );
    } finally {
      setIsDetectingLocation(false);
    }
  };

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
              Enter Further <Text style={styles.details}>Details</Text>
            </Text>

            {/* Age Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>What's Your Name?</Text>
              <TextInput
                style={styles.ageInput}
                placeholder="e.g. John Doe"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                keyboardType="text"
              />
            </View>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>What's Your Age?</Text>
              <TextInput
                style={styles.ageInput}
                placeholder="e.g. 17 Years"
                placeholderTextColor="#999"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>What's Your Phone Number?</Text>
              <TextInput
                style={styles.ageInput}
                placeholder="e.g. +1 549 000 0000"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
              />
            </View>

            {/* Delivery Address Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <TextInput
                style={styles.ageInput}
                placeholder="Enter your delivery address"
                placeholderTextColor="#999"
                value={address}
                onChangeText={setAddress}
                keyboardType="default"
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
              
              {/* Location Detection Button */}
              <TouchableOpacity
                style={[styles.locationButton, isDetectingLocation && styles.locationButtonDisabled]}
                onPress={detectLocation}
                disabled={isDetectingLocation}
              >
                {isDetectingLocation ? (
                  <ActivityIndicator size="small" color="#07da63" />
                ) : (
                  <Ionicons name="location" size={20} color="#07da63" />
                )}
                <Text style={styles.locationButtonText}>
                  {isDetectingLocation ? 'Detecting...' : 'Detect My Location'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Activity Level Dropdown */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Activity Level</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowActivityModal(true)}
              >
                <View style={styles.dropdownContent}>
                  <View>
                    <Text style={styles.dropdownText}>{activityLevel}</Text>
                    <Text style={styles.dropdownSubtext}>
                      {activityLevels.find(level => level.value === activityLevel)?.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Gender Selection */}
            <View style={styles.genderSection}>
              <Text style={styles.inputLabel}>Select Gender</Text>
              
              <View style={styles.genderOptions}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedGender === 'male' && styles.selectedGender
                  ]}
                  onPress={() => setSelectedGender('male')}
                >
                  <View style={styles.genderIconContainer}>
                    <Ionicons 
                      name="man" 
                      size={40} 
                      color={selectedGender === 'male' ? '#07da63' : '#ccc'} 
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedGender === 'female' && styles.selectedGender
                  ]}
                  onPress={() => setSelectedGender('female')}
                >
                  <View style={styles.genderIconContainer}>
                    <Ionicons 
                      name="woman" 
                      size={40} 
                      color={selectedGender === 'female' ? '#07da63' : '#ccc'} 
                    />
                  </View>
                </TouchableOpacity>
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
            onPress={() => {
              updateName(name);
              updatePersonalInfo(parseInt(age), selectedGender);
              updatePhone(phone);
              updateAddress(address);
              updateActivityLevel(activityLevel);
              router.push('/paymentmethod');
            }}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Activity Level Modal */}
        <Modal
          visible={showActivityModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowActivityModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowActivityModal(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Activity Level</Text>
                <TouchableOpacity onPress={() => setShowActivityModal(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.activityOption,
                    activityLevel === level.value && styles.selectedActivity
                  ]}
                  onPress={() => {
                    setActivityLevel(level.value);
                    setShowActivityModal(false);
                  }}
                >
                  <View style={styles.activityOptionContent}>
                    <Text style={[
                      styles.activityOptionTitle,
                      activityLevel === level.value && styles.selectedActivityText
                    ]}>
                      {level.label}
                    </Text>
                    <Text style={styles.activityOptionDesc}>
                      {level.description}
                    </Text>
                  </View>
                  {activityLevel === level.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#07da63" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FurtherDetails;

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
    width: '100%',
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
    marginBottom: 40,
    textAlign: 'center',
  },
  details: {
    color: '#07da63',
  },
  inputSection: {
    width: '100%',
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  ageInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  genderSection: {
    width: '100%',
    alignItems: 'center',
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
  },
  genderOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedGender: {
    borderColor: '#07da63',
    backgroundColor: '#f0fdf4',
  },
  genderIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#07da63',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  locationButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  locationButtonText: {
    color: '#07da63',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  dropdownButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  activityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
  },
  selectedActivity: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#07da63',
  },
  activityOptionContent: {
    flex: 1,
  },
  activityOptionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedActivityText: {
    fontWeight: '600',
    color: '#07da63',
  },
  activityOptionDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});
