import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TestPush = () => {
  const router = useRouter();
  const [result, setResult] = useState('');

  const testNotificationPackages = async () => {
    let results = [];
    
    // Test 1: Check if packages exist
    try {
      const Notifications = require('expo-notifications');
      results.push('✅ expo-notifications: Loaded');
      
      // Test 2: Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      results.push(`📋 Current permission: ${existingStatus}`);
      
      if (existingStatus !== 'granted') {
        results.push('🔔 Requesting permission...');
        const { status } = await Notifications.requestPermissionsAsync();
        results.push(`✅ Permission result: ${status}`);
        
        if (status === 'granted') {
          Alert.alert('Success!', 'Notification permissions granted!');
        } else {
          Alert.alert('Denied', 'You denied notification permissions. Enable in Settings.');
        }
      } else {
        Alert.alert('Already Allowed', 'Notification permissions already granted!');
      }
      
      // Test 3: Get push token
      try {
        const Device = require('expo-device');
        const Constants = require('expo-constants');
        
        if (Device.isDevice) {
          const token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId,
          });
          results.push(`✅ Push Token: ${token.data}`);
        } else {
          results.push('⚠️ Not a physical device');
        }
      } catch (e) {
        results.push(`❌ Token error: ${e.message}`);
      }
      
    } catch (error) {
      results.push('❌ expo-notifications: NOT LOADED');
      results.push(`Error: ${error.message}`);
      Alert.alert(
        'Packages Missing',
        'Notification packages are not in this APK. You need to rebuild with the packages included.'
      );
    }
    
    setResult(results.join('\n'));
    console.log(results.join('\n'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Push Notification Test</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={testNotificationPackages}>
          <Ionicons name="notifications" size={24} color="#fff" />
          <Text style={styles.buttonText}>Test Notification Packages</Text>
        </TouchableOpacity>

        {result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}

        <View style={styles.info}>
          <Text style={styles.infoTitle}>What This Tests:</Text>
          <Text style={styles.infoText}>• If expo-notifications is loaded</Text>
          <Text style={styles.infoText}>• Current permission status</Text>
          <Text style={styles.infoText}>• Requests permission if needed</Text>
          <Text style={styles.infoText}>• Gets push token</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#07da63',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  info: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default TestPush;








