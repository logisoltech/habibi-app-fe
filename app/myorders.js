import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNavigation from './components/BottomNavigation';

export default function MyOrders() {
  // Sample orders data matching the image
  const orders = [
    {
      id: 1,
      planName: 'Balanced Plan, Week 2',
      category: 'OPTIONAL',
      price: 'AED 1083.66',
      totalMeals: 12,
      status: 'In Progress',
      statusColor: '#FFA500',
      statusIcon: 'time-outline'
    },
    {
      id: 2,
      planName: 'Balanced Plan, Week 3',
      category: 'OPTIONAL',
      price: 'AED 860.66',
      totalMeals: 10,
      status: 'Cancelled',
      statusColor: '#FF6B6B',
      statusIcon: 'close-circle-outline'
    },
    {
      id: 3,
      planName: 'Balanced Plan, Week 1',
      category: 'OPTIONAL',
      price: 'AED 1083.66',
      totalMeals: 12,
      status: 'Delivered',
      statusColor: '#4CAF50',
      statusIcon: 'checkmark-circle-outline'
    }
  ];

  const handleBackPress = () => {
    router.back();
  };

  const renderOrderCard = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.planName}>{order.planName}</Text>
          <Text style={styles.category}>{order.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: order.statusColor }]}>
          <Ionicons name={order.statusIcon} size={12} color="white" />
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total Amount</Text>
          <Text style={styles.detailValue}>{order.price}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total Meals</Text>
          <Text style={styles.detailValue}>{order.totalMeals}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Orders List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {orders.map(order => renderOrderCard(order))}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <BottomNavigation activeTab="orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Raleway-Bold',
  },
  category: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    fontFamily: 'Raleway-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Raleway-Bold',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontFamily: 'Raleway-Regular',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },
});
