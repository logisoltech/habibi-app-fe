import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserData } from './contexts/UserDataContext';

const Login = () => {
  const router = useRouter();
  const { updatePhone, checkUserExists, loadUserData } = useUserData();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const isPhoneValid = phone.trim().length > 0;

  const handleLogin = async () => {
    if (!isPhoneValid) return;

    setLoading(true);
    try {
      // Update phone in context
      updatePhone(phone);

      // Check if user exists
      const result = await checkUserExists(phone);

      if (result.exists) {
        // User exists, load their data and go to home
        loadUserData(result.user);
        Alert.alert(
          'Welcome Back!',
          'Your account has been found. Redirecting to your dashboard.',
          [
            {
              text: 'Continue',
              onPress: () => router.push('/home')
            }
          ]
        );
      } else {
        // User doesn't exist, go to registration flow
        Alert.alert(
          'New User',
          'Phone number not found. You will be redirected to create your account.',
          [
            {
              text: 'Continue',
              onPress: () => router.push('/detailform')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    if (isPhoneValid) {
      updatePhone(phone);
    }
    router.push('/detailform');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Go Back</Text>
        </TouchableOpacity>

        <View style={styles.contentWrapper}>
          <Text style={styles.mainTitle}>Login to your account</Text>
          <Text style={styles.subtitle}>Good to see you again, enter your details below to continue ordering.</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter Your Phone Number</Text>
            <TextInput
              style={styles.phoneinput}
              placeholder="+92 000 0000000"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* Bottom: Login Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.loginButton,
              (!isPhoneValid || loading) && styles.disabledButton,
            ]}
            disabled={!isPhoneValid || loading}
            onPress={handleLogin}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login to my account</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleCreateAccount} style={styles.createAccountButton}>
            <Text style={styles.createAccountText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 16,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  phoneinput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 100,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  loginButton: {
    backgroundColor: '#07da63',
    paddingVertical: 12,
    borderRadius: 100,
    marginBottom: 10,
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  createAccountButton: {
    paddingVertical: 16,
    width: '100%',
    alignSelf: 'center',
  },
  createAccountText: {
    color: '#07da63',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdeacb',
  },
});
