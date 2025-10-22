import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { fetchDeliveriesByDate } from './services/deliveryAPI';
import { useUserData } from './contexts/UserDataContext';

const OrderHistory = () => {
  const router = useRouter();
  const { userData } = useUserData();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.userId) {
      loadUserAndOrders();
    }
  }, [userData?.userId]);

  const loadUserAndOrders = async () => {
    try {
      setLoading(true);
      
      // Get user ID from context
      const userId = userData?.userId;
      if (!userId) {
        console.warn('No user ID found. Please log in.');
        setLoading(false);
        return;
      }
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      console.log('📅 Fetching deliveries for:', dateStr, 'User:', userId);
      
      // Fetch deliveries for today
      const response = await fetchDeliveriesByDate(dateStr, { userId: userId });
      
      if (response.success && response.data && response.data.length > 0) {
        // Transform the API data into the format expected by the UI
        const transformedOrders = response.data.flatMap(delivery => {
          return delivery.meals.map((meal, index) => ({
            id: `${delivery.userId}-${meal.id}-${index}`,
            orderNumber: `ORD-${dateStr.replace(/-/g, '')}-${index + 1}`,
            date: formatDate(dateStr),
            meals: [
              {
                name: meal.name,
                quantity: 1,
                calories: meal.calories,
                protein: meal.protein,
                carbs: meal.carbs,
                fat: meal.fat,
              }
            ],
            totalPrice: 0, // You can calculate based on meal data if needed
            status: mapStatus(meal.status),
            tracking: getTrackingFromStatus(meal.status, meal.statusUpdatedAt),
            user: {
              name: delivery.userName,
              phone: delivery.phone,
              address: delivery.address,
            }
          }));
        });
        
        setOrders(transformedOrders);
      } else {
        console.log('No deliveries found for today');
        setOrders([]);
      }
      
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const mapStatus = (apiStatus) => {
    // Map API status to UI status
    const statusMap = {
      'pending': 'pending',
      'preparing': 'in_process',
      'out_for_delivery': 'in_process',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
    };
    return statusMap[apiStatus] || 'pending';
  };

  const getTrackingFromStatus = (status, statusUpdatedAt) => {
    const now = new Date();
    const time = statusUpdatedAt ? new Date(statusUpdatedAt).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : 'Pending';
    
    const dateStr = statusUpdatedAt ? new Date(statusUpdatedAt).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) : '';

    switch (status) {
      case 'delivered':
        return {
          leftKitchen: { time, date: dateStr, completed: true },
          outForDelivery: { time, date: dateStr, completed: true },
          delivered: { time, date: dateStr, completed: true },
        };
      case 'out_for_delivery':
        return {
          leftKitchen: { time, date: dateStr, completed: true },
          outForDelivery: { time, date: dateStr, completed: true },
          delivered: { time: 'Pending', date: '', completed: false },
        };
      case 'preparing':
        return {
          leftKitchen: { time, date: dateStr, completed: true },
          outForDelivery: { time: 'Pending', date: '', completed: false },
          delivered: { time: 'Pending', date: '', completed: false },
        };
      default:
        return {
          leftKitchen: { time: 'Pending', date: '', completed: false },
          outForDelivery: { time: 'Pending', date: '', completed: false },
          delivered: { time: 'Pending', date: '', completed: false },
        };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered':
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'in_process':
        return { backgroundColor: '#fff3e0', color: '#f57c00' };
      case 'pending':
        return { backgroundColor: '#e3f2fd', color: '#1976d2' };
      case 'cancelled':
        return { backgroundColor: '#ffebee', color: '#c62828' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#757575' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in_process':
        return 'In Process';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return 'checkmark-circle';
      case 'in_process':
        return 'time';
      case 'pending':
        return 'hourglass';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
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
        <Text style={styles.headerTitle}>Today's Orders</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadUserAndOrders}
        >
          <Ionicons name="refresh" size={24} color="#07da63" />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#07da63" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Orders Today</Text>
          <Text style={styles.emptyText}>
            You don't have any scheduled meals for today
          </Text>
        </View>
      ) : (
        /* Orders List */
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {orders.map((order) => {
          const statusStyle = getStatusStyle(order.status);
          
          return (
            <View key={order.id} style={styles.orderCard}>
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                  <Ionicons 
                    name={getStatusIcon(order.status)} 
                    size={14} 
                    color={statusStyle.color} 
                    style={styles.statusIcon}
                  />
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Meals List */}
              <View style={styles.mealsContainer}>
                {order.meals.map((meal, index) => (
                  <View key={index} style={styles.mealItem}>
                    <View style={styles.mealIconContainer}>
                      <Ionicons name="restaurant" size={16} color="#07da63" />
                    </View>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealQuantity}>x{meal.quantity}</Text>
                  </View>
                ))}
              </View>

              {/* Order Footer */}
              <View style={styles.orderFooter}>
                
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => {
                    setSelectedOrder(order);
                    setShowDetailsModal(true);
                  }}
                >
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

          {/* Empty space at bottom */}
          <View style={styles.bottomSpace} />
        </ScrollView>
      )}

      {/* Order Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDetailsModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedOrder && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Order Details</Text>
                    <Text style={styles.modalOrderNumber}>{selectedOrder.orderNumber}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowDetailsModal(false)}
                    style={styles.modalCloseButton}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.modalScrollView}
                  contentContainerStyle={styles.modalScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Order Items Section */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Items Ordered</Text>
                    {selectedOrder.meals.map((meal, index) => (
                      <View key={index} style={styles.modalMealItem}>
                        <View style={styles.modalMealIconContainer}>
                          <Ionicons name="restaurant" size={18} color="#07da63" />
                        </View>
                        <Text style={styles.modalMealName}>{meal.name}</Text>
                        <Text style={styles.modalMealQuantity}>x{meal.quantity}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Tracking Timeline - Only 3 stages */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Order Tracking</Text>
                    
                    {/* Left Kitchen */}
                    <View style={styles.timelineItem}>
                      <View style={styles.timelineIconContainer}>
                        <View style={[
                          styles.timelineIcon,
                          selectedOrder.tracking?.leftKitchen?.completed && styles.timelineIconCompleted
                        ]}>
                          <Ionicons 
                            name={selectedOrder.tracking?.leftKitchen?.completed ? "checkmark" : "ellipse-outline"} 
                            size={16} 
                            color={selectedOrder.tracking?.leftKitchen?.completed ? "#fff" : "#999"} 
                          />
                        </View>
                        {selectedOrder.tracking?.outForDelivery?.completed && <View style={styles.timelineLine} />}
                      </View>
                      <View style={styles.timelineContent}>
                        <Text style={styles.timelineTitle}>Left Kitchen</Text>
                        <Text style={styles.timelineTime}>
                          {selectedOrder.tracking?.leftKitchen?.time || 'Pending'}
                          {selectedOrder.tracking?.leftKitchen?.date ? ` - ${selectedOrder.tracking.leftKitchen.date}` : ''}
                        </Text>
                      </View>
                    </View>

                    {/* Out for Delivery */}
                    <View style={styles.timelineItem}>
                      <View style={styles.timelineIconContainer}>
                        <View style={[
                          styles.timelineIcon,
                          selectedOrder.tracking?.outForDelivery?.completed && styles.timelineIconCompleted
                        ]}>
                          <Ionicons 
                            name={selectedOrder.tracking?.outForDelivery?.completed ? "checkmark" : "ellipse-outline"} 
                            size={16} 
                            color={selectedOrder.tracking?.outForDelivery?.completed ? "#fff" : "#999"} 
                          />
                        </View>
                        {selectedOrder.tracking?.delivered?.completed && <View style={styles.timelineLine} />}
                      </View>
                      <View style={styles.timelineContent}>
                        <Text style={styles.timelineTitle}>Out for Delivery</Text>
                        <Text style={styles.timelineTime}>
                          {selectedOrder.tracking?.outForDelivery?.time || 'Pending'}
                          {selectedOrder.tracking?.outForDelivery?.date ? ` - ${selectedOrder.tracking.outForDelivery.date}` : ''}
                        </Text>
                      </View>
                    </View>

                    {/* Delivered */}
                    <View style={styles.timelineItem}>
                      <View style={styles.timelineIconContainer}>
                        <View style={[
                          styles.timelineIcon,
                          selectedOrder.tracking?.delivered?.completed && styles.timelineIconCompleted
                        ]}>
                          <Ionicons 
                            name={selectedOrder.tracking?.delivered?.completed ? "checkmark" : "ellipse-outline"} 
                            size={16} 
                            color={selectedOrder.tracking?.delivered?.completed ? "#fff" : "#999"} 
                          />
                        </View>
                      </View>
                      <View style={styles.timelineContent}>
                        <Text style={styles.timelineTitle}>Delivered</Text>
                        <Text style={styles.timelineTime}>
                          {selectedOrder.tracking?.delivered?.time || 'Pending'}
                          {selectedOrder.tracking?.delivered?.date ? ` - ${selectedOrder.tracking.delivered.date}` : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  refreshButton: {
    padding: 8,
    marginRight: -8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#757575',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  mealsContainer: {
    marginBottom: 12,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  mealQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#07da63',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#07da63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#07da63',
  },
  reorderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#07da63',
  },
  reorderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpace: {
    height: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  modalOrderNumber: {
    fontSize: 14,
    color: '#666',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    flexGrow: 1,
  },
  modalScrollContent: {
    paddingBottom: 24,
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  modalMealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalMealIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalMealName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  modalMealQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  // Timeline Styles
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  timelineIconCompleted: {
    backgroundColor: '#07da63',
    borderColor: '#07da63',
  },
  timelineLine: {
    width: 2,
    height: 26,
    backgroundColor: '#07da63',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 13,
    color: '#666',
  },
});

export default OrderHistory;

