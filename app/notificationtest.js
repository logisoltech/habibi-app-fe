import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserData } from './contexts/UserDataContext';
import { fetchUserNotifications, sendTestNotification } from './services/notificationAPI';

const NotificationTest = () => {
  const router = useRouter();
  const { userData } = useUserData();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testTitle, setTestTitle] = useState('Test Notification');
  const [testMessage, setTestMessage] = useState('This is a test notification!');

  const handleFetchNotifications = async () => {
    if (!userData?.userId) {
      Alert.alert('Error', 'No user ID found. Please log in first.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('=== FETCHING NOTIFICATIONS ===');
      console.log('User ID:', userData.userId);
      
      const response = await fetchUserNotifications(userData.userId, false);
      
      console.log('=== RESPONSE ===');
      console.log(JSON.stringify(response, null, 2));
      
      setResult({
        success: true,
        data: response,
        message: `Found ${response.data?.length || 0} notifications`,
      });
      
      Alert.alert(
        'Success!',
        `Found ${response.data?.length || 0} notifications\n${response.unreadCount || 0} unread`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('=== ERROR ===');
      console.error(error);
      
      setResult({
        success: false,
        error: error.message,
      });
      
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestNotification = async () => {
    if (!userData?.userId) {
      Alert.alert('Error', 'No user ID found. Please log in first.');
      return;
    }

    if (!testTitle.trim() || !testMessage.trim()) {
      Alert.alert('Error', 'Please enter title and message');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('=== SENDING TEST NOTIFICATION ===');
      console.log('User ID:', userData.userId);
      console.log('Title:', testTitle);
      console.log('Message:', testMessage);
      
      const response = await sendTestNotification({
        userId: userData.userId,
        title: testTitle,
        message: testMessage,
        type: 'general',
        priority: 'normal',
      });
      
      console.log('=== RESPONSE ===');
      console.log(JSON.stringify(response, null, 2));
      
      setResult({
        success: true,
        data: response,
        message: 'Notification sent successfully!',
      });
      
      Alert.alert(
        'Success!',
        'Test notification sent! Check the notifications tab.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('=== ERROR ===');
      console.error(error);
      
      setResult({
        success: false,
        error: error.message,
      });
      
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckDatabase = () => {
    const url = `https://habibi-fitness-server.onrender.com/api/notifications/user/${userData?.userId}`;
    Alert.alert(
      'Check Database',
      `Open this URL in your browser:\n\n${url}\n\nYou should see JSON with notifications if they exist.`,
      [
        { text: 'Cancel' },
        { 
          text: 'Copy URL', 
          onPress: () => {
            // In a real app, you'd copy to clipboard
            console.log('URL:', url);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Test</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Info</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{userData?.userId || 'Not logged in'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{userData?.name || 'Unknown'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{userData?.phone || 'Unknown'}</Text>
          </View>
        </View>

        {/* Test Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Actions</Text>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={handleFetchNotifications}
            disabled={loading}
          >
            <Ionicons name="download" size={20} color="#fff" />
            <Text style={styles.testButtonText}>
              {loading ? 'Loading...' : 'Fetch Notifications'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, styles.secondaryButton]}
            onPress={handleCheckDatabase}
          >
            <Ionicons name="search" size={20} color="#07da63" />
            <Text style={[styles.testButtonText, styles.secondaryButtonText]}>
              Check Database
            </Text>
          </TouchableOpacity>
        </View>

        {/* Send Test Notification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Test Notification</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Notification Title"
            value={testTitle}
            onChangeText={setTestTitle}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notification Message"
            value={testMessage}
            onChangeText={setTestMessage}
            multiline
            numberOfLines={3}
          />
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={handleSendTestNotification}
            disabled={loading}
          >
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.testButtonText}>
              {loading ? 'Sending...' : 'Send Test Notification'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Result Display */}
        {result && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Result</Text>
            <View style={[
              styles.resultCard,
              result.success ? styles.successCard : styles.errorCard
            ]}>
              <View style={styles.resultHeader}>
                <Ionicons 
                  name={result.success ? 'checkmark-circle' : 'close-circle'} 
                  size={24} 
                  color={result.success ? '#07da63' : '#ff4444'} 
                />
                <Text style={styles.resultTitle}>
                  {result.success ? 'Success' : 'Error'}
                </Text>
              </View>
              <Text style={styles.resultMessage}>{result.message || result.error}</Text>
              {result.data && (
                <ScrollView horizontal style={styles.jsonContainer}>
                  <Text style={styles.jsonText}>
                    {JSON.stringify(result.data, null, 2)}
                  </Text>
                </ScrollView>
              )}
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Troubleshooting</Text>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>✅ If Fetch Works:</Text>
            <Text style={styles.instructionText}>
              Notifications will appear in the bell icon. Open the browser URL to see raw database data.
            </Text>
          </View>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>❌ If Fetch Fails:</Text>
            <Text style={styles.instructionText}>
              1. Check server is running: node server.js{'\n'}
              2. Check API URL: https://habibi-fitness-server.onrender.com{'\n'}
              3. Check userId exists{'\n'}
              4. Check console logs for errors
            </Text>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07da63',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#07da63',
  },
  secondaryButtonText: {
    color: '#07da63',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  successCard: {
    borderColor: '#07da63',
  },
  errorCard: {
    borderColor: '#ff4444',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  resultMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  jsonContainer: {
    maxHeight: 200,
  },
  jsonText: {
    fontSize: 12,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  instructionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});

export default NotificationTest;

