import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  TextInput,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNavigation from './components/BottomNavigation';

export default function Checkout2() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Bank Card');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const deliveryInfo = {
    name: 'Amelia Cassin',
    address: '102nd St Ports, New York',
    phone: '458-419-7182'
  };

  const paymentMethods = ['Bank Card', 'Credit Card', 'PayPal', 'Apple Pay'];
  
  const totalAmount = 'AED 10002.66';

  const handleBackPress = () => {
    router.back();
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentMethods(false);
  };

  const handleConfirmPay = () => {
    // Navigate to confirm order page
    router.push('/confirmorder');
  };

  const renderPaymentMethodDropdown = () => (
    <View style={styles.paymentMethodContainer}>
      <TouchableOpacity 
        style={styles.paymentMethodButton}
        onPress={() => setShowPaymentMethods(!showPaymentMethods)}
      >
        <Text style={styles.paymentMethodText}>{selectedPaymentMethod}</Text>
        <Ionicons 
          name={showPaymentMethods ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#333" 
        />
      </TouchableOpacity>
      
      {showPaymentMethods && (
        <View style={styles.paymentMethodDropdown}>
          {paymentMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={styles.paymentMethodOption}
              onPress={() => handlePaymentMethodSelect(method)}
            >
              <Text style={styles.paymentMethodOptionText}>{method}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderCreditCard = () => (
    <View style={styles.creditCard}>
      {/* Card Background */}
      <View style={styles.cardBackground}>
        {/* Left section - Beige */}
        <View style={styles.cardLeftSection}>
          {/* Nubia Logo */}
          <View style={styles.cardLogo}>
            <Text style={styles.cardLogoText}>nubia</Text>
          </View>
          
          {/* Chip */}
          <View style={styles.cardChip}>
            <View style={styles.chipInner} />
          </View>
          
          {/* Card Number Dots */}
          <View style={styles.cardNumberContainer}>
            {[...Array(8)].map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.cardNumberDot,
                  index === 6 && styles.cardNumberDotFilled,
                  index === 7 && styles.cardNumberDotBlack
                ]} 
              />
            ))}
          </View>
          
          {/* Cardholder Name */}
          <Text style={styles.cardholderName}>{deliveryInfo.name}</Text>
        </View>
        
        {/* Right section - Grey */}
        <View style={styles.cardRightSection}>
          {/* Expiry Date */}
          <Text style={styles.expiryDate}>02/26</Text>
          
          {/* Visa Logo */}
          <View style={styles.visaLogo}>
            <Text style={styles.visaText}>VISA</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Deliver to Section */}
        <View style={styles.deliverySection}>
          <Text style={styles.sectionLabel}>Deliver to:</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.mapContainer}>
              <View style={styles.mapIcon}>
                <Ionicons name="location" size={20} color="#FF6B6B" />
              </View>
            </View>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryName}>{deliveryInfo.name}</Text>
              <View style={styles.addressRow}>
                <Text style={styles.deliveryAddress}>{deliveryInfo.address}</Text>
                <Ionicons name="chevron-down" size={16} color="#999" />
              </View>
              <Text style={styles.deliveryPhone}>{deliveryInfo.phone}</Text>
            </View>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Payment Method Section */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentHeader}>
            <Text style={styles.sectionLabel}>Payment method</Text>
            <TouchableOpacity>
              <Text style={styles.addPaymentText}>Add payment method</Text>
            </TouchableOpacity>
          </View>
          
          {renderPaymentMethodDropdown()}
          
          {/* Credit Card Display */}
          {renderCreditCard()}
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <Text style={styles.sectionLabel}>Total to pay</Text>
          <Text style={styles.totalAmount}>{totalAmount}</Text>
        </View>
      </ScrollView>

      {/* Confirm & Pay Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmPay}
        >
          <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom Navigation */}
      <BottomNavigation activeTab="orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  deliverySection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Raleway-Bold',
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  mapContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mapIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Raleway-Bold',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    fontFamily: 'Raleway-Regular',
  },
  deliveryPhone: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Raleway-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  paymentSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addPaymentText: {
    fontSize: 14,
    color: '#6C63FF',
    fontFamily: 'Raleway-Regular',
  },
  paymentMethodContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Raleway-Regular',
  },
  paymentMethodDropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentMethodOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  paymentMethodOptionText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Raleway-Regular',
  },
  creditCard: {
    marginTop: 20,
  },
  cardBackground: {
    height: 200,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardLeftSection: {
    flex: 2,
    backgroundColor: '#F5F5DC', // Beige color
    padding: 20,
    justifyContent: 'space-between',
  },
  cardRightSection: {
    flex: 1,
    backgroundColor: '#D3D3D3', // Light grey
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLogo: {
    marginBottom: 20,
  },
  cardLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  cardChip: {
    width: 40,
    height: 30,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInner: {
    width: 30,
    height: 20,
    backgroundColor: '#FFA500',
    borderRadius: 2,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cardNumberDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
  },
  cardNumberDotFilled: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  cardNumberDotBlack: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  cardholderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  expiryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  visaLogo: {
    alignItems: 'flex-end',
  },
  visaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1F71',
    fontFamily: 'Raleway-Bold',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  bottomButtonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
});

