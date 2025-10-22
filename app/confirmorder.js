import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNavigation from './components/BottomNavigation';

const { width, height } = Dimensions.get('window');

export default function ConfirmOrder() {
  const handleBackPress = () => {
    router.back();
  };

  const handleTrackOrder = () => {
    // Navigate to order tracking page
    router.push('/myorders');
  };

  const handleGoHome = () => {
    // Navigate back to home page
    router.push('/home');
  };

  const renderConfettiDots = () => {
    const dots = [];
    const colors = ['#20B2AA', '#FF6B6B']; // Teal and orange
    const positions = [
      { top: '15%', left: '20%' },
      { top: '25%', right: '15%' },
      { top: '35%', left: '10%' },
      { top: '45%', right: '25%' },
      { top: '55%', left: '25%' },
      { top: '65%', right: '10%' },
      { top: '75%', left: '15%' },
      { top: '85%', right: '20%' },
    ];

    positions.forEach((position, index) => {
      const color = colors[index % colors.length];
      dots.push(
        <View
          key={index}
          style={[
            styles.confettiDot,
            {
              backgroundColor: color,
              top: position.top,
              left: position.left,
              right: position.right,
            }
          ]}
        />
      );
    });

    return dots;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Success Graphic */}
        <View style={styles.successGraphicContainer}>
          {/* Confetti Dots */}
          {renderConfettiDots()}
          
          {/* Main Success Circle */}
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={60} color="#20B2AA" />
          </View>
        </View>

        {/* Confirmation Text */}
        <View style={styles.textContainer}>
          <Text style={styles.mainTitle}>Your order has been successfully placed</Text>
          <Text style={styles.subtitle}>
            We'll keep you updated every step of the way so you know exactly when to expect your meal.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={handleTrackOrder}
          >
            <Text style={styles.trackButtonText}>Track your order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={handleGoHome}
          >
            <Text style={styles.homeButtonText}>Go back to home</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Bottom Navigation */}
      <BottomNavigation activeTab="orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successGraphicContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    height: 200,
    width: 200,
  },
  confettiDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#20B2AA',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#20B2AA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
    fontFamily: 'Raleway-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Raleway-Regular',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  trackButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  homeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
});
