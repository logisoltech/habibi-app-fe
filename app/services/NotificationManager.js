import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useUserData } from '../contexts/UserDataContext';
import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  setBadgeCount,
  savePushTokenToServer,
} from './pushNotificationService';
import { fetchUserNotifications } from './notificationAPI';

/**
 * Custom hook to manage push notifications
 * Use this in your main app layout (_layout.js)
 */
export function useNotificationManager() {
  const router = useRouter();
  const { userData } = useUserData();
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize push notifications
  useEffect(() => {
    if (userData?.userId) {
      setupPushNotifications();
      loadUnreadCount();
    }

    return () => {
      // Clean up listeners if they exist
      try {
        if (notificationListener.current && notificationListener.current.remove) {
          notificationListener.current.remove();
        }
        if (responseListener.current && responseListener.current.remove) {
          responseListener.current.remove();
        }
      } catch (error) {
        // Silently fail cleanup
      }
    };
  }, [userData?.userId]);

  const setupPushNotifications = async () => {
    try {
      // Register for push notifications and get token
      const token = await registerForPushNotificationsAsync();
      
      if (token) {
        setExpoPushToken(token);
        console.log('✅ Push token obtained:', token);
        
        // Save token to server
        if (userData?.userId) {
          await savePushTokenToServer(userData.userId, token);
        }
      } else {
        console.log('📱 Running in Expo Go - Push notifications disabled');
        console.log('💡 In-app notifications are still active!');
      }

      // Listen for notifications when app is foregrounded (only if available)
      const receivedListener = addNotificationReceivedListener(handleNotificationReceived);
      if (receivedListener) {
        notificationListener.current = receivedListener;
      }

      // Listen for notification taps (only if available)
      const responseListenerObj = addNotificationResponseReceivedListener(handleNotificationResponse);
      if (responseListenerObj) {
        responseListener.current = responseListenerObj;
      }

    } catch (error) {
      console.warn('⚠️ Push notifications setup skipped:', error.message);
      console.log('📱 In-app notifications will still work!');
    }
  };

  const loadUnreadCount = async () => {
    if (!userData?.userId) return;

    try {
      const response = await fetchUserNotifications(userData.userId, true);
      if (response.success) {
        const count = response.unreadCount || 0;
        setUnreadCount(count);
        await setBadgeCount(count);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleNotificationReceived = (notification) => {
    console.log('🔔 Notification received:', notification);
    
    // Update unread count
    loadUnreadCount();

    // You can show a custom in-app notification here if needed
    // or let the system handle it (default behavior)
  };

  const handleNotificationResponse = (response) => {
    console.log('👆 Notification tapped:', response);
    
    const data = response.notification.request.content.data;
    
    // Navigate based on notification type
    if (data.type === 'delivery' || data.screen === 'orderhistory') {
      router.push('/orderhistory');
    } else if (data.type === 'promotion' || data.screen === 'meals') {
      router.push('/meals');
    } else if (data.screen) {
      router.push(data.screen);
    }
    
    // Refresh unread count
    loadUnreadCount();
  };

  // Public method to manually refresh unread count
  const refreshUnreadCount = () => {
    loadUnreadCount();
  };

  return {
    expoPushToken,
    unreadCount,
    refreshUnreadCount,
  };
}

export default useNotificationManager;

