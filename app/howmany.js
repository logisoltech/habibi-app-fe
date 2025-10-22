import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from './contexts/UserDataContext';
import RevenueCatService from './services/revenueCatService';

const HowMany = () => {
  const router = useRouter();
  const { updateSubscription, updateMealCount, updateSelectedDays } = useUserData();

  const dayItems = [
    { key: 'SUN', label: 'S' },
    { key: 'MON', label: 'M' },
    { key: 'TUE', label: 'T' },
    { key: 'WED', label: 'W' },
    { key: 'THU', label: 'T' },
    { key: 'FRI', label: 'F' },
    { key: 'SAT', label: 'S' },
  ];

  const [selectedDays, setSelectedDays] = useState([]);
  const [billingCycle, setBillingCycle] = useState('weekly');

  const toggleDay = (key) => {
    setSelectedDays((prev) => {
      const exists = prev.includes(key);
      if (exists) {
        // Allow deselect; button will be disabled if below 5
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  const isFormValid = selectedDays.length >= 5 && !!billingCycle;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Days in a week */}
          <View style={styles.block}>
            <Text style={styles.heading}>How many days a week are you eating with us?</Text>
            <Text style={styles.subtitle}>Select a minimum of 5 days</Text>

            <View style={styles.daysRow}>
              {dayItems.map((d) => {
                const active = selectedDays.includes(d.key);
                return (
                  <TouchableOpacity
                    key={d.key}
                    style={[styles.dayCircle, active && styles.dayCircleActive]}
                    onPress={() => toggleDay(d.key)}
                  >
                    <Text style={[styles.dayText, active && styles.dayTextActive]}>{d.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Payment cycle */}
          <View style={styles.block}>
            <Text style={styles.sectionTitle}>Payment Cycle</Text>
            {(() => {
              const pricing = RevenueCatService.getLocationBasedPricing();
              return [
                { key: 'weekly', title: 'Weekly', sub: `${pricing.weekly.price} per week`, price: `${pricing.weekly.price}/day` },
                { key: 'monthly', title: 'Monthly', sub: `${pricing.monthly.price} per month`, price: `${pricing.monthly.price}/day` },
                { key: 'quarterly', title: '3-months', sub: `${pricing.quarterly.price} Quarterly`, price: `${pricing.quarterly.price}/day` },
              ];
            })().map((opt) => {
              const active = billingCycle === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.planRow, active && styles.planRowActive]}
                  onPress={() => setBillingCycle(opt.key)}
                >
                  <View>
                    <Text style={[styles.planTitle, active && styles.planTitleActive]}>{opt.title}</Text>
                    <Text style={styles.planSub}>{opt.sub}</Text>
                  </View>
                  <View style={styles.planRight}>
                    <Text style={[styles.planPrice, active && styles.planPriceActive]}>{opt.price}</Text>
                    <Ionicons
                      name={active ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={active ? '#07da63' : '#d1d5db'}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !isFormValid && styles.disabledButton]}
            disabled={!isFormValid}
            onPress={() => {
              // Save subscription, meal count, and selected days to context
              updateSubscription(billingCycle);
              updateMealCount(selectedDays.length);
              updateSelectedDays(selectedDays);
              // Navigate to paywall for payment
              router.push({
                pathname: '/paywall',
                params: {
                  billingCycle: billingCycle,
                  selectedDays: JSON.stringify(selectedDays)
                }
              });
            }}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HowMany;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    paddingVertical: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#07da63',
    borderRadius: 2,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  block: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dayCircleActive: {
    backgroundColor: '#07da63',
    borderColor: '#07da63',
  },
  dayText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
    marginTop: 24,
  },
  planRow: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planRowActive: {
    borderColor: '#07da63',
    backgroundColor: '#f0fff6',
  },
  planTitle: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
  },
  planTitleActive: {
    color: '#07da63',
  },
  planSub: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  planRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planPrice: {
    color: '#374151',
    fontWeight: '600',
  },
  planPriceActive: {
    color: '#07da63',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#07da63',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#c9f2d7',
  },
  nextText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});



