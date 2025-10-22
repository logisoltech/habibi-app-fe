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
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from './contexts/UserDataContext';

const PaymentMethod = () => {
  const router = useRouter();
  const { updatePaymentInfo } = useUserData();
  const [cardNumber, setCardNumber] = useState('');
  const [cvcCvv, setCvcCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [serviceProvider, setServiceProvider] = useState('VISA');
  const [showProviderModal, setShowProviderModal] = useState(false);

  const serviceProviders = ['VISA', 'Mastercard', 'UnionPay', 'American Express', 'JCB'];

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleCardNumberChange = (text) => {
    const cleaned = text.replace(/\s/g, '');
    if (cleaned.length <= 16) {
      setCardNumber(formatCardNumber(cleaned));
    }
  };

  // Format expiry date (MM/YY)
  const handleExpiryDateChange = (text) => {
    const cleaned = text.replace(/\//g, '');
    if (cleaned.length <= 4) {
      if (cleaned.length >= 2) {
        setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2));
      } else {
        setExpiryDate(cleaned);
      }
    }
  };

  // Limit CVC/CVV to 3-4 digits
  const handleCvcChange = (text) => {
    if (text.length <= 4) {
      setCvcCvv(text);
    }
  };

  const isFormValid = 
    cardNumber.replace(/\s/g, '').length === 16 && 
    cvcCvv.length >= 3 && 
    expiryDate.length === 5;

  const handleNext = () => {
    if (isFormValid) {
      // Save payment information to context
      updatePaymentInfo(
        cardNumber.replace(/\s/g, ''), // Remove spaces from card number
        cvcCvv,
        expiryDate,
        serviceProvider
      );
      
      Alert.alert('Success', 'Payment details saved!', [
        { text: 'OK', onPress: () => router.push('/meals') }
      ]);
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
              Payment <Text style={styles.details}>Method</Text>
            </Text>

            {/* Payment Method Display */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.paymentMethodContainer}>
                <Ionicons name="card" size={24} color="#07da63" />
                <Text style={styles.paymentMethodText}>Bank card only</Text>
              </View>
            </View>

            {/* Service Provider Dropdown */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Service Provider</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowProviderModal(true)}
              >
                <Text style={styles.dropdownText}>{serviceProvider}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Card Number Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#999"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            {/* CVC/CVV Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>CVC/CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#999"
                value={cvcCvv}
                onChangeText={handleCvcChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />
            </View>

            {/* Expiry Date Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#999"
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                keyboardType="numeric"
                maxLength={5}
              />
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
            onPress={handleNext}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Service Provider Modal */}
        <Modal
          visible={showProviderModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowProviderModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowProviderModal(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Service Provider</Text>
                <TouchableOpacity onPress={() => setShowProviderModal(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {serviceProviders.map((provider) => (
                <TouchableOpacity
                  key={provider}
                  style={[
                    styles.providerOption,
                    serviceProvider === provider && styles.selectedProvider
                  ]}
                  onPress={() => {
                    setServiceProvider(provider);
                    setShowProviderModal(false);
                  }}
                >
                  <Text style={[
                    styles.providerOptionText,
                    serviceProvider === provider && styles.selectedProviderText
                  ]}>
                    {provider}
                  </Text>
                  {serviceProvider === provider && (
                    <Ionicons name="checkmark" size={24} color="#07da63" />
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

export default PaymentMethod;

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
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  paymentMethodContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#07da63',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 12,
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
  dropdownButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
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
  providerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
  },
  selectedProvider: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#07da63',
  },
  providerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedProviderText: {
    fontWeight: '600',
    color: '#07da63',
  },
});

