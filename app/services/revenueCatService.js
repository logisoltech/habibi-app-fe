import Purchases from 'react-native-purchases';
import * as Localization from 'expo-localization';
import { Platform } from 'react-native';

class RevenueCatService {
  constructor() {
    this.isInitialized = false;
    this.currentOffering = null;
    this.userCountry = null;
  }

  // Get user's country for pricing
  getUserCountry() {
    if (!this.userCountry) {
      try {
        // Try to get locale from expo-localization
        const locale = Localization.locale || 'en-AE';
        console.log('Detected locale:', locale);
        
        // Extract country code from locale (e.g., 'en-PK' -> 'PK')
        if (locale && locale.includes('-')) {
          this.userCountry = locale.split('-')[1];
        } else if (locale && locale.includes('_')) {
          this.userCountry = locale.split('_')[1];
        } else {
          this.userCountry = 'AE'; // Default to UAE
        }
        
        console.log('Detected country:', this.userCountry);
      } catch (error) {
        console.log('Could not detect country, defaulting to UAE:', error.message);
        this.userCountry = 'AE';
      }
    }
    return this.userCountry;
  }

  // Get pricing based on user's location
  getLocationBasedPricing() {
    const country = this.getUserCountry();
    const isPakistan = country === 'PK';
    
    console.log('Country detected:', country, 'Is Pakistan:', isPakistan);
    
    if (isPakistan) {
      return {
        weekly: { price: 'PKR 500', period: 'per week', savings: '' },
        monthly: { price: 'PKR 1,000', period: 'per month', savings: 'Save 20%' },
        quarterly: { price: 'PKR 10,000', period: 'per 3 months', savings: 'Save 33%' }
      };
    } else {
      // Default UAE pricing
      return {
        weekly: { price: 'AED 549.99', period: 'per week', savings: '' },
        monthly: { price: 'AED 1,899.99', period: 'per month', savings: 'Save 23%' },
        quarterly: { price: 'AED 5,399.99', period: 'per 3 months', savings: 'Save 35%' }
      };
    }
  }

  // Manual override for testing (you can call this to force a specific country)
  setTestCountry(countryCode) {
    this.userCountry = countryCode;
    console.log('Test country set to:', countryCode);
  }

  async initialize() {
    if (this.isInitialized) return;

    // Skip initialization in web environment
    if (Platform.OS === 'web') {
      console.log('⚠️ RevenueCat not supported in web environment');
      this.isInitialized = true;
      return;
    }

    try {
      // Initialize RevenueCat SDK with proper platform detection
      const config = {
        apiKey: 'goog_hTnbgnReUraJuuQwODomtNxtOcP', // Your Android API key
      };

      console.log('Initializing RevenueCat with config:', config);
      await Purchases.configure(config);

      // Set user attributes (optional) - using valid attribute names
      await Purchases.setAttributes({
        'app_version': '2.0.0',
        'platform': 'android',
      });

      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      this.currentOffering = offerings.current;
      return offerings.current;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      console.log('⚠️ This is likely due to Google Play Console configuration issues');
      
      // Return a mock offering for testing purposes with location-based pricing
      const pricing = this.getLocationBasedPricing();
      const country = this.getUserCountry();
      
      return {
        identifier: 'default',
        serverDescription: `Default offering (${country})`,
        availablePackages: [
          {
            identifier: 'premium_weekly_access',
            packageType: 'WEEKLY',
            product: {
              identifier: 'premium_weekly_access',
              description: 'Weekly Premium Access',
              title: 'Weekly Premium',
              priceString: pricing.weekly.price
            }
          },
          {
            identifier: 'premium_monthly_access',
            packageType: 'MONTHLY',
            product: {
              identifier: 'premium_monthly_access',
              description: 'Monthly Premium Access',
              title: 'Monthly Premium',
              priceString: pricing.monthly.price
            }
          },
          {
            identifier: 'premium_quarterly_access',
            packageType: 'ANNUAL',
            product: {
              identifier: 'premium_quarterly_access',
              description: 'Quarterly Premium Access',
              title: 'Quarterly Premium',
              priceString: pricing.quarterly.price
            }
          }
        ]
      };
    }
  }

  async purchasePackage(packageToPurchase) {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      // Check if user has premium access
      const hasPremiumAccess = customerInfo.entitlements.active['premium_access'] !== undefined;
      
      return {
        success: true,
        hasPremiumAccess,
        customerInfo,
      };
    } catch (error) {
      console.error('Purchase failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async restorePurchases() {
    try {
      const customerInfo = await Purchases.restorePurchases();
      const hasPremiumAccess = customerInfo.entitlements.active['premium_access'] !== undefined;
      
      return {
        success: true,
        hasPremiumAccess,
        customerInfo,
      };
    } catch (error) {
      console.error('Restore purchases failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async checkSubscriptionStatus() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const hasPremiumAccess = customerInfo.entitlements.active['premium_access'] !== undefined;
      
      return {
        hasPremiumAccess,
        customerInfo,
      };
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return {
        hasPremiumAccess: false,
        error: error.message,
      };
    }
  }

  async getProductPrice(productId) {
    try {
      const offerings = await this.getOfferings();
      if (!offerings) return null;

      // Find the package with matching product ID
      const packageItem = offerings.availablePackages.find(pkg => pkg.identifier === productId);
      return packageItem ? packageItem.product.priceString : null;
    } catch (error) {
      console.error('Failed to get product price:', error);
      return null;
    }
  }
}

export default new RevenueCatService();
