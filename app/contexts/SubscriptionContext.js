import React, { createContext, useContext, useState, useEffect } from 'react';
import RevenueCatService from '../services/revenueCatService';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    initializeSubscription();
  }, []);

  const initializeSubscription = async () => {
    try {
      await RevenueCatService.initialize();
      const status = await RevenueCatService.checkSubscriptionStatus();
      
      setIsPremium(status.hasPremiumAccess);
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Failed to initialize subscription:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      const status = await RevenueCatService.checkSubscriptionStatus();
      
      setIsPremium(status.hasPremiumAccess);
      setSubscriptionStatus(status);
      return status;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseSubscription = async (packageToPurchase) => {
    try {
      setIsLoading(true);
      const result = await RevenueCatService.purchasePackage(packageToPurchase);
      
      if (result.success && result.hasPremiumAccess) {
        setIsPremium(true);
        setSubscriptionStatus(result.customerInfo);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      const result = await RevenueCatService.restorePurchases();
      
      if (result.success && result.hasPremiumAccess) {
        setIsPremium(true);
        setSubscriptionStatus(result.customerInfo);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isPremium,
    isLoading,
    subscriptionStatus,
    checkSubscriptionStatus,
    purchaseSubscription,
    restorePurchases,
    initializeSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};





