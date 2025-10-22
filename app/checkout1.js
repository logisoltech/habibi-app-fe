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

export default function Checkout1() {
  const [selectedDay, setSelectedDay] = useState(1); // Monday selected by default
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [promoCode, setPromoCode] = useState('');

  const days = ['S', 'S', 'M', 'T', 'W', 'T', 'F'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

  const selectedItems = [
    {
      id: 1,
      name: 'Salad',
      description: 'Greek-wedge',
      price: 'AED 20.34',
      image: require('../assets/caesar.jpg'), // Using existing image
    },
    {
      id: 2,
      name: 'Milkshake',
      description: 'Chocolate Milkshake',
      price: 'AED 20.34',
      image: require('../assets/burger.jpg'), // Using existing image as placeholder
    }
  ];

  const paymentSummary = {
    planPrice: 'AED 9999.66',
    deliveryFee: 'AED 1002.00',
    total: 'AED 10002.66'
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleDaySelect = (index) => {
    setSelectedDay(index);
  };

  const handleMealTypeSelect = (mealType) => {
    setSelectedMealType(mealType);
  };

  const handleRemoveItem = (itemId) => {
    // Handle item removal logic here
    console.log('Remove item:', itemId);
  };

  const handleProceedToPay = () => {
    // Navigate to checkout2 page
    router.push('/checkout2');
  };

  const renderDayButton = (day, index) => {
    const isSelected = selectedDay === index;
    const isActive = index >= 1 && index <= 5; // Monday to Friday
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayButton,
          isSelected && styles.dayButtonSelected,
          isActive && !isSelected && styles.dayButtonActive
        ]}
        onPress={() => handleDaySelect(index)}
      >
        <Text style={[
          styles.dayButtonText,
          isSelected && styles.dayButtonTextSelected,
          isActive && !isSelected && styles.dayButtonTextActive
        ]}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMealTypeTab = (mealType) => {
    const isSelected = selectedMealType === mealType;
    
    return (
      <TouchableOpacity
        key={mealType}
        style={[
          styles.mealTypeTab,
          isSelected && styles.mealTypeTabSelected
        ]}
        onPress={() => handleMealTypeSelect(mealType)}
      >
        <Text style={[
          styles.mealTypeTabText,
          isSelected && styles.mealTypeTabTextSelected
        ]}>
          {mealType}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSelectedItem = (item) => (
    <View key={item.id} style={styles.selectedItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Ionicons name="close" size={16} color="#666" />
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Your Package, Your Way</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Package Overview */}
        <View style={styles.packageOverview}>
          <Text style={styles.packageTitle}>Your Package, Your Way</Text>
          <Text style={styles.packageSummary}>Balanced, 2 meals, 6 days a week</Text>
          <Text style={styles.promptText}>Last minute changes?</Text>
        </View>

        {/* Day Selection */}
        <View style={styles.daySelection}>
          <View style={styles.dayButtonsContainer}>
            {days.map((day, index) => renderDayButton(day, index))}
          </View>
        </View>

        {/* Meal Type Tabs */}
        <View style={styles.mealTypeTabs}>
          {mealTypes.map(mealType => renderMealTypeTab(mealType))}
        </View>

        {/* Selected Items */}
        <View style={styles.selectedItemsSection}>
          {selectedItems.map(item => renderSelectedItem(item))}
        </View>

        {/* Promo Code Input */}
        <View style={styles.promoCodeSection}>
          <TextInput
            style={styles.promoCodeInput}
            placeholder="Enter promo code"
            placeholderTextColor="#999"
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity style={styles.promoCodeButton}>
            <Ionicons name="send" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Payment Summary */}
        <View style={styles.paymentSummary}>
          <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Your Plan</Text>
            <Text style={styles.paymentValue}>{paymentSummary.planPrice}</Text>
          </View>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Delivery Fee</Text>
            <Text style={styles.paymentValue}>{paymentSummary.deliveryFee}</Text>
          </View>
          
          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{paymentSummary.total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Proceed to Pay Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={styles.proceedButton}
          onPress={handleProceedToPay}
        >
          <Text style={styles.proceedButtonText}>Proceed to Pay</Text>
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
    fontSize: 16,
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
  packageOverview: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Raleway-Bold',
  },
  packageSummary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
    fontFamily: 'Raleway-Bold',
  },
  promptText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Raleway-Regular',
  },
  daySelection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  dayButtonActive: {
    backgroundColor: '#E8F5E8',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'Raleway-Bold',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  dayButtonTextActive: {
    color: '#4CAF50',
  },
  mealTypeTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mealTypeTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  mealTypeTabSelected: {
    backgroundColor: '#E8F5E8',
  },
  mealTypeTabText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Raleway-Regular',
  },
  mealTypeTabTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
    fontFamily: 'Raleway-Bold',
  },
  selectedItemsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    fontFamily: 'Raleway-Bold',
  },
  itemDescription: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
    fontFamily: 'Raleway-Regular',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  removeButton: {
    padding: 8,
  },
  promoCodeSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  promoCodeInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Raleway-Regular',
    marginRight: 12,
  },
  promoCodeButton: {
    width: 44,
    height: 44,
    backgroundColor: '#333',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentSummary: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  paymentSummaryTitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Raleway-Regular',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Raleway-Regular',
  },
  paymentValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  totalValue: {
    fontSize: 16,
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
  proceedButton: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
});
