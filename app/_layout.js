import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { UserDataProvider } from './contexts/UserDataContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { useNotificationManager } from './services/NotificationManager';

// Inner component that uses NotificationManager
function AppContent() {
  // Initialize push notifications
  const { expoPushToken, unreadCount } = useNotificationManager();

  useEffect(() => {
    if (expoPushToken) {
      console.log('✅ Push notifications registered! Token:', expoPushToken);
    } else {
      console.log('📱 Running without push notifications (will work in dev build)');
    }
  }, [expoPushToken]);

  useEffect(() => {
    console.log('🔔 Unread notification count:', unreadCount);
  }, [unreadCount]);

  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
        contentStyle: { padding: 0 },
      }}
    />
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <UserDataProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </UserDataProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
