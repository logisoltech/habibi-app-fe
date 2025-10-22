import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const heroImage = require('../assets/caesar.jpg');
const ingredientImg = require('../assets/fish.png');

const macros = [
  { label: 'Protein', value: '95g', color: '#ff7f7f' },
  { label: 'Carbs', value: '95g', color: '#69a7ff' },
  { label: 'Fats', value: '95g', color: '#ffc34d' },
  { label: 'Fiber', value: '95g', color: '#c7c7c7' },
];

const ingredients = [
  ingredientImg,
  ingredientImg,
  ingredientImg,
  ingredientImg,
  ingredientImg,
  ingredientImg,
];

const RecipeInner = () => {

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top','bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => {}}>
            <Ionicons name="heart-outline" size={18} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Title + chip */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Salad with thousand island{"\n"}dressing</Text>
          <View style={styles.chipRow}>
            <View style={styles.calChipDot} />
            <Text style={styles.calChipText}>410 cal | Low Calorie</Text>
          </View>
        </View>

        {/* Hero Image */}
        <Image source={heroImage} style={styles.hero} />

        {/* Price + cart */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>AED 139</Text>
          <TouchableOpacity style={styles.cartBtn}>
            <Ionicons name="cart-outline" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Nutrition Facts */}
        <Text style={styles.sectionTitle}>Nutrition Facts</Text>
        <View style={styles.nutritionRow}>
          {/* Kcal ring */}
          <View style={styles.kcalRingWrap}>
            <View style={styles.kcalRingBase}>
              <Text style={styles.kcalTextSmall}>Kcal</Text>
              <Text style={styles.kcalTextBig}>2145</Text>
            </View>
            <View style={styles.kcalProgress} />
          </View>

          {/* Macro small circles */}
          <View style={styles.macroGrid}>
            {macros.map((m, i) => (
              <View key={i} style={styles.macroSmall}>
                <View style={[styles.macroSmallRing, { borderColor: m.color }]}> 
                  <Text style={[styles.macroValue, { color: m.color }]}>{m.value}</Text>
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery info */}
        <View style={styles.deliveryBlock}>
          <Text style={styles.deliveryTitle}>Delivery info</Text>
          <Text style={styles.deliveryText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tempus, odio e aliquet commodo, quam <Text style={styles.readMore}>Read More...</Text>
          </Text>
        </View>

        {/* Ingredients */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Ingredients</Text>
        <View style={styles.ingGrid}>
          {ingredients.map((src, idx) => (
            <View key={idx} style={styles.ingTile}>
              <Image source={src} style={styles.ingImg} />
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeInner;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 24, paddingTop: 8 },

  headerActions: {
    paddingHorizontal: 16,
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBlock: { paddingHorizontal: 16, paddingTop: 8 },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '700', color: '#111' },
  chipRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  calChipDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#07da63', marginRight: 6 },
  calChipText: { color: '#8c8c8c', fontSize: 12 },

  hero: { width: '100%', height: 180, marginTop: 10, resizeMode: 'cover' },

  priceRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { color: '#0db162', fontWeight: '800', fontSize: 18 },
  cartBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#f6f6f6', alignItems: 'center', justifyContent: 'center'
  },

  sectionTitle: { paddingHorizontal: 16, marginTop: 14, marginBottom: 8, fontWeight: '600', color: '#222' },

  nutritionRow: { flexDirection: 'row', paddingHorizontal: 16 },

  kcalRingWrap: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  kcalRingBase: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', borderWidth: 8, borderColor: '#e9f7ee'
  },
  kcalTextSmall: { color: '#9AA0A6', fontSize: 12 },
  kcalTextBig: { color: '#111', fontSize: 20, fontWeight: '800' },
  kcalProgress: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    borderWidth: 10, borderColor: '#07da63', borderTopColor: 'transparent', borderLeftColor: 'transparent', transform: [{ rotate: '30deg' }]
  },

  macroGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingLeft: 12 },
  macroSmall: { width: '48%', alignItems: 'center', marginBottom: 10 },
  macroSmallRing: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 3,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2,
  },
  macroValue: { fontSize: 12, fontWeight: '700' },
  macroLabel: { fontSize: 10, color: '#8c8c8c' },

  deliveryBlock: { paddingHorizontal: 16, paddingTop: 8 },
  deliveryTitle: { fontWeight: '600', color: '#222', marginBottom: 6 },
  deliveryText: { color: '#666', lineHeight: 18, fontSize: 13 },
  readMore: { color: '#07da63', fontWeight: '600' },

  ingGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  ingTile: {
    width: 56, height: 56, borderRadius: 12, backgroundColor: '#f8f9fb',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2,
  },
  ingImg: { width: 34, height: 34, resizeMode: 'contain' },
});
