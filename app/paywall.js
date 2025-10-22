import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RevenueCatService from './services/revenueCatService';

const Paywall = () => {
  const router = useRouter();
  const { billingCycle, selectedDays } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [offering, setOffering] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Map your billing cycles to RevenueCat product IDs
  const productIdMap = {
    weekly: 'premium_weekly_access',
    monthly: 'premium_monthly_access',
    quarterly: 'premium_quarterly_access'
  };

  // Get location-based pricing from RevenueCat service
  const pricingDisplay = RevenueCatService.getLocationBasedPricing();

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      await RevenueCatService.initialize();
      const offerings = await RevenueCatService.getOfferings();
      setOffering(offerings);
      
      // Auto-select the package based on billing cycle
      const targetProductId = productIdMap[billingCycle];
      if (offerings && targetProductId) {
        const packageItem = offerings.availablePackages.find(pkg => 
          pkg.identifier === targetProductId || 
          pkg.product.identifier === targetProductId
        );
        if (packageItem) {
          setSelectedPackage(packageItem);
        }
      }
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      Alert.alert('Error', 'Failed to load subscription options. Please try again.');
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }

    setLoading(true);
    try {
      const result = await RevenueCatService.purchasePackage(selectedPackage);
      
      if (result.success && result.hasPremiumAccess) {
        Alert.alert(
          'Success!',
          'Your subscription is now active. Welcome to premium!',
          [
            {
              text: 'Continue',
              onPress: () => {
                // Navigate to allergies page after successful payment
                router.replace('/allergies');
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Purchase Failed',
          result.error || 'Something went wrong with your purchase. Please try again.'
        );
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const result = await RevenueCatService.restorePurchases();
      
      if (result.success && result.hasPremiumAccess) {
        Alert.alert(
          'Restored!',
          'Your previous subscription has been restored.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/allergies')
            }
          ]
        );
      } else {
        Alert.alert('No Subscription Found', 'No active subscription found to restore.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentPricing = pricingDisplay[billingCycle] || pricingDisplay.monthly;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>
              Unlock unlimited access to all our premium features and start your fitness journey today!
            </Text>
          </View>

          {/* Selected Plan Display */}
          <View style={styles.selectedPlanContainer}>
            <View style={styles.planHeader}>
              <View style={styles.planIcon}>
                <Ionicons name="diamond" size={24} color="#07da63" />
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>{billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)} Plan</Text>
                <Text style={styles.planDays}>
                  {(() => {
                    try {
                      return JSON.parse(selectedDays || '[]').length;
                    } catch (error) {
                      return 7; // Default fallback
                    }
                  })()} days per week
                </Text>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{currentPricing.price}</Text>
              <Text style={styles.period}>{currentPricing.period}</Text>
              {currentPricing.savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>{currentPricing.savings}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>What's included:</Text>
            {[
              'Unlimited access to all recipes',
              'Personalized meal plans',
              'Nutrition tracking',
              'Priority customer support',
              'Weekly progress reports',
              'Exclusive premium content'
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#07da63" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.purchaseButton, loading && styles.disabledButton]}
          disabled={loading}
          onPress={handlePurchase}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.purchaseButtonText}>Start Subscription</Text>
              <Text style={styles.purchaseButtonSubtext}>Cancel anytime</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={loading}
        >
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  content: {
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  selectedPlanContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#07da63',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  planDays: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'center',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#07da63',
    marginBottom: 4,
  },
  period: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  savingsBadge: {
    backgroundColor: '#07da63',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  purchaseButton: {
    backgroundColor: '#07da63',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  purchaseButtonSubtext: {
    color: '#e8f5e9',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#bdeacb',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    color: '#07da63',
    fontSize: 16,
    fontWeight: '500',
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default Paywall;
