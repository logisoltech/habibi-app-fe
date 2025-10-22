import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configure how notifications are handled when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

console.log('📱 Push Notification Service: Loaded');
console.log('🔔 Notification packages active!');

/**
 * Register for push notifications and get the Expo Push Token
 * @returns {Promise<string|null>} Expo Push Token or null if not available
 */
export async function registerForPushNotificationsAsync() {
  let token;

  try {
    console.log('🔔 Starting push notification registration...');
    console.log('📱 Platform:', Platform.OS);
    console.log('📱 Is Device:', Device.isDevice);
    
    if (Platform.OS === 'android') {
      console.log('🤖 Setting up Android notification channel...');
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#07da63',
      });
      console.log('✅ Android channel configured');
    }

    if (Device.isDevice) {
      console.log('📱 Checking existing permissions...');
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('📋 Current permission status:', existingStatus);
      
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        console.log('🔔 Requesting notification permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('📋 Permission request result:', status);
      }
      
      if (finalStatus !== 'granted') {
        console.error('❌ User denied notification permissions!');
        console.log('💡 Enable in Settings → Apps → Habibi Fitness → Permissions');
        return null;
      }
      
      console.log('✅ Permissions granted! Getting push token...');
      
      // Get the Expo Push Token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.manifest?.extra?.eas?.projectId;
      console.log('🎯 Project ID:', projectId);
      
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      
      token = tokenData.data;
      console.log('✅ Expo Push Token obtained:', token);
    } else {
      console.warn('⚠️ Not a physical device - push notifications won\'t work');
      return null;
    }
  } catch (error) {
    console.error('❌ Push notification registration failed!');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    return null;
  }

  return token;
}

/**
 * Handle notification received while app is in foreground
 * @param {function} callback - Callback function to handle notification
 * @returns {Subscription|null} Notification subscription or null if not available
 */
export function addNotificationReceivedListener(callback) {
  try {
    return Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification received (foreground):', notification);
      callback(notification);
    });
  } catch (error) {
    console.warn('⚠️ Could not add notification listener:', error.message);
    return null;
  }
}

/**
 * Handle notification response (user tapped on notification)
 * @param {function} callback - Callback function to handle notification tap
 * @returns {Subscription|null} Notification subscription or null if not available
 */
export function addNotificationResponseReceivedListener(callback) {
  try {
    return Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      callback(response);
    });
  } catch (error) {
    console.warn('⚠️ Could not add notification response listener:', error.message);
    return null;
  }
}

/**
 * Schedule a local notification (for testing)
 * @param {object} options - { title, body, data, trigger }
 */
export async function scheduleLocalNotification(options) {
  try {
    const { title, body, data = {}, trigger = null } = options;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || null, // null means send immediately
    });

    console.log('✅ Local notification scheduled');
  } catch (error) {
    console.warn('⚠️ Could not schedule notification:', error.message);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ All scheduled notifications cancelled');
  } catch (error) {
    console.warn('⚠️ Could not cancel notifications:', error.message);
  }
}

/**
 * Get notification badge count
 * @returns {Promise<number>} Badge count
 */
export async function getBadgeCount() {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    return 0;
  }
}

/**
 * Set notification badge count
 * @param {number} count - Badge count
 */
export async function setBadgeCount(count) {
  try {
    await Notifications.setBadgeCountAsync(count);
    console.log(`✅ Badge count set to ${count}`);
  } catch (error) {
    // Silently fail - not critical
  }
}

/**
 * Clear all notifications from notification center
 */
export async function dismissAllNotifications() {
  try {
    await Notifications.dismissAllNotificationsAsync();
    console.log('✅ All notifications dismissed');
  } catch (error) {
    console.warn('⚠️ Could not dismiss notifications:', error.message);
  }
}

/**
 * Save Expo Push Token to server
 * @param {string} userId - User ID
 * @param {string} token - Expo Push Token
 * @param {string} apiUrl - API base URL
 */
export async function savePushTokenToServer(userId, token, apiUrl = 'https://habibi-fitness-server.onrender.com') {
  try {
    const response = await fetch(`${apiUrl}/api/users/${userId}/push-token`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pushToken: token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save push token');
    }

    console.log('✅ Push token saved to server');
    return data;
  } catch (error) {
    console.error('❌ Error saving push token:', error);
    // Don't throw - this shouldn't block the app
  }
}

