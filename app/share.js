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
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Share = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const isFormValid = name.trim() && email.trim() && phone.trim() && beforeImage && afterImage;

  const pickImage = async (type) => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (type === 'before') {
        setBeforeImage(imageUri);
      } else {
        setAfterImage(imageUri);
      }
    }
  };

  const removeImage = (type) => {
    if (type === 'before') {
      setBeforeImage(null);
    } else {
      setAfterImage(null);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill in all fields and upload both images');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success!',
        'Your transformation has been shared successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#111" />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Share Your Transformation</Text>
            <Text style={styles.subtitle}>
              Inspire others by sharing your fitness journey! Upload your before and after photos.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+92 000 0000000"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Before Picture */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Before Picture</Text>
              <TouchableOpacity 
                style={styles.imagePicker}
                onPress={() => pickImage('before')}
              >
                {beforeImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: beforeImage }} style={styles.imagePreview} />
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeImage('before')}
                    >
                      <Ionicons name="close-circle" size={28} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imagePickerContent}>
                    <View style={styles.iconCircle}>
                      <Ionicons name="camera" size={32} color="#07da63" />
                    </View>
                    <Text style={styles.imagePickerText}>Upload Before Photo</Text>
                    <Text style={styles.imagePickerSubtext}>Tap to select from gallery</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* After Picture */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>After Picture</Text>
              <TouchableOpacity 
                style={styles.imagePicker}
                onPress={() => pickImage('after')}
              >
                {afterImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: afterImage }} style={styles.imagePreview} />
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeImage('after')}
                    >
                      <Ionicons name="close-circle" size={28} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imagePickerContent}>
                    <View style={styles.iconCircle}>
                      <Ionicons name="camera" size={32} color="#07da63" />
                    </View>
                    <Text style={styles.imagePickerText}>Upload After Photo</Text>
                    <Text style={styles.imagePickerSubtext}>Tap to select from gallery</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isFormValid || loading) && styles.disabledButton,
            ]}
            disabled={!isFormValid || loading}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Share Transformation</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
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
  formSection: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 100,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  imagePicker: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 16,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  imagePickerContent: {
    alignItems: 'center',
    padding: 20,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  imagePickerSubtext: {
    fontSize: 14,
    color: '#999',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#07da63',
    paddingVertical: 12,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#bdeacb',
  },
});

export default Share;















