import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PackageCart = () => {
  const router = useRouter();

  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [addGym, setAddGym] = useState(false);

  const basePlanBhd = 48;
  const deliveryBhd = 1;
  const vatRate = 0.1; // 10%
  const gymQuarterlyNote = 'If you subscribe to quarterly package.';

  const discountBhd = useMemo(() => {
    if (!promoApplied) return 0;
    // Simple fixed discount for demo purposes
    return 2; // BHD 2 off when applied
  }, [promoApplied]);

  const planAfterDiscount = Math.max(0, basePlanBhd - discountBhd);
  const subTotal = planAfterDiscount + deliveryBhd;
  const vatBhd = parseFloat((subTotal * vatRate).toFixed(1));
  const totalBhd = parseFloat((subTotal + vatBhd).toFixed(1));

  const canApply = promo.trim().length > 0 && !promoApplied;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Card */}
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Your package, your way</Text>
                <Text style={styles.subtitle}>Balanced, 2 Meals, 7 days per week</Text>
              </View>
              <View style={styles.bagIconWrap}>
                <Ionicons name="bag-outline" size={26} color="#07da63" />
              </View>
            </View>

            {/* Promotion code */}
            <View style={styles.promoRow}>
              <View style={styles.promoInputWrap}>
                <Ionicons name="pricetag-outline" size={18} color="#9AA0A6" />
                <TextInput
                  style={styles.promoInput}
                  placeholder="Add promotion code"
                  placeholderTextColor="#9AA0A6"
                  value={promo}
                  onChangeText={setPromo}
                />
              </View>
              <TouchableOpacity
                style={[styles.applyBtn, !canApply && styles.applyBtnDisabled]}
                disabled={!canApply}
                onPress={() => setPromoApplied(true)}
              >
                <Text style={styles.applyText}>{promoApplied ? 'Applied' : 'Apply'}</Text>
              </TouchableOpacity>
            </View>

            {/* Gym membership upsell */}
            <TouchableOpacity style={styles.gymRow} onPress={() => setAddGym(!addGym)}>
              <View style={styles.gymLeft}>
                <View style={styles.ticketEdge} />
                <View style={styles.gymIcon}>
                  <Ionicons name="barbell-outline" size={18} color="#07da63" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gymTitle}>3 month gym membership</Text>
                  <Text style={styles.gymNote}>{gymQuarterlyNote}</Text>
                </View>
                <Ionicons
                  name={addGym ? 'remove-circle' : 'add-circle'}
                  size={22}
                  color="#07da63"
                />
                <View style={[styles.ticketEdge, { transform: [{ rotate: '180deg' }] }]} />
              </View>
            </TouchableOpacity>

            {/* Payment summary */}
            <Text style={styles.summaryTitle}>Payment summary</Text>

            <View style={styles.row}> 
              <Text style={styles.rowLabel}>Plan price</Text>
              <Text style={styles.rowValue}>BHD {planAfterDiscount}</Text>
            </View>
            <View style={styles.row}> 
              <Text style={styles.rowLabel}>Delivery fee</Text>
              <Text style={styles.rowValue}>BHD {deliveryBhd}</Text>
            </View>
            <View style={styles.row}> 
              <Text style={styles.rowLabel}>VAT (10%)</Text>
              <Text style={styles.rowValue}>BHD {vatBhd}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}> 
              <Text style={[styles.rowLabel, styles.totalLabel]}>Total</Text>
              <Text style={[styles.rowValue, styles.totalValue]}>BHD {totalBhd}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.continueBtn} onPress={() => router.push('/allergies')}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PackageCart;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 120 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#eef2ef',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  bagIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ecfdf3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#111' },
  subtitle: { color: '#6b7280', marginTop: 2 },

  promoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  promoInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  promoInput: { flex: 1, color: '#111', fontSize: 14 },
  applyBtn: {
    marginLeft: 8,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#e5f5ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: { backgroundColor: '#f1f5f9' },
  applyText: { color: '#9aa0a6', fontWeight: '700' },

  gymRow: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  gymLeft: { flexDirection: 'row', alignItems: 'center' },
  gymIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ecfdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  gymTitle: { color: '#111827', fontWeight: '600' },
  gymNote: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  ticketEdge: {
    width: 12,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#f7faf9',
    marginHorizontal: 6,
  },

  summaryTitle: { marginTop: 16, marginBottom: 8, fontWeight: '700', color: '#1f2937' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: '#374151' },
  rowValue: { color: '#111827', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eef2ef', marginVertical: 8 },
  totalLabel: { fontWeight: '700' },
  totalValue: { fontWeight: '800' },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  continueBtn: {
    backgroundColor: '#07da63',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});



