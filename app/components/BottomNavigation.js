import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserData } from '../contexts/UserDataContext';
import { fetchUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationAPI';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function BottomNavigation({ activeTab = 'home' }) {
  const router = useRouter();
  const { userData } = useUserData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('📱 BottomNavigation: UserData changed', { userId: userData?.userId, hasData: !!userData });
    if (userData?.userId) {
      console.log('✅ User ID found, loading notifications...');
      loadNotifications();
    } else {
      console.log('⚠️ No user ID yet, skipping notification load');
    }
  }, [userData?.userId]);

  // Auto-refresh notifications every 30 seconds when modal is open
  useEffect(() => {
    if (showNotifications && userData?.userId) {
      const interval = setInterval(() => {
        loadNotifications(true); // Silent refresh
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [showNotifications, userData?.userId]);

  const loadNotifications = async (silent = false) => {
    if (!userData?.userId) {
      console.log('⚠️ No userId found in context. User needs to log in.');
      return;
    }
    
    try {
      if (!silent) setLoading(true);
      
      console.log('🔔 Loading notifications for user:', userData.userId);
      const response = await fetchUserNotifications(userData.userId, false);
      console.log('📡 Notification API response:', response);
      
      if (response.success) {
        // Transform notifications to include icon and color based on type
        const transformedNotifications = (response.data || []).map(notif => ({
          ...notif,
          icon: getIconForType(notif.type),
          iconColor: getColorForType(notif.type),
          time: getTimeAgo(notif.created_at),
        }));
        
        console.log(`✅ Loaded ${transformedNotifications.length} notifications, ${response.unreadCount} unread`);
        setNotifications(transformedNotifications);
        setUnreadCount(response.unreadCount || 0);
      } else {
        console.error('❌ API returned success=false:', response);
      }
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
      console.error('Error details:', error.message);
      // Don't show error to user, just log it
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Handle navigation based on notification type
    if (notification.type === 'delivery') {
      setShowNotifications(false);
      router.push('/orderhistory');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userData?.userId) return;
    
    try {
      await markAllNotificationsAsRead(userData.userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIconForType = (type) => {
    const iconMap = {
      'delivery': 'checkmark-circle',
      'promotion': 'pricetag',
      'alert': 'warning',
      'general': 'information-circle',
    };
    return iconMap[type] || 'notifications';
  };

  const getColorForType = (type) => {
    const colorMap = {
      'delivery': '#07da63',
      'promotion': '#ff9800',
      'alert': '#f44336',
      'general': '#2196f3',
    };
    return colorMap[type] || '#666';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return notifTime.toLocaleDateString();
  };

  const tabs = [
    {
      id: 'home',
      icon: 'home',
      route: '/home',
    },
    {
      id: 'calender',
      icon: 'calendar-outline',
      route: '/calendar',
    },
    {
      id: 'orders',
      icon: 'restaurant-outline',
      route: '/recipe',
    },
    {
      id: 'history',
      icon: 'time-outline',
      route: '/orderhistory',
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      route: '/notifications',
    },
  ];

  const handleTabPress = (tab) => {
    if (tab.id === 'notifications') {
      console.log('🔔 Opening notifications modal...');
      console.log('👤 Current user data:', { 
        userId: userData?.userId, 
        name: userData?.name,
        hasUserData: !!userData 
      });
      
      setShowNotifications(true);
      
      // Refresh notifications when opening modal
      if (userData?.userId) {
        console.log('✅ User is logged in, loading notifications...');
        loadNotifications();
      } else {
        console.error('❌ USER NOT LOGGED IN! No userId in context.');
        console.log('💡 Please log in first via the Login screen.');
      }
    } else {
      router.push(tab.route);
    }
  };

  const renderTab = (tab) => {
    const isActive = activeTab === tab.id;
    const isOrdersTab = tab.id === 'orders';

    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tab}
        onPress={() => handleTabPress(tab)}
      >
        {isOrdersTab ? (
          <View style={styles.ordersTabContainer}>
            <View style={[styles.ordersTab, isActive && styles.ordersTabActive]}>
              <Ionicons 
                name={tab.icon} 
                size={20} 
                color={isActive ? '#fff' : '#333'} 
              />
            </View>
            {isActive && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.tabContainer}>
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={isActive ? '#07da63' : '#999'} 
            />
            {tab.id === 'notifications' && unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {tabs.map(renderTab)}
      </View>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNotifications(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Ionicons name="notifications" size={24} color="#07da63" />
                <Text style={styles.modalTitle}>Notifications</Text>
                {unreadCount > 0 && (
                  <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  onPress={handleRefresh}
                  style={styles.refreshIconButton}
                >
                  <Ionicons name="refresh" size={20} color="#07da63" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setShowNotifications(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Notifications List */}
            {!userData?.userId ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="log-in-outline" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>Please Log In</Text>
                <Text style={styles.emptyText}>
                  Log in to view your notifications and order updates.
                </Text>
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={() => {
                    setShowNotifications(false);
                    router.push('/login');
                  }}
                >
                  <Text style={styles.loginButtonText}>Go to Login</Text>
                </TouchableOpacity>
              </View>
            ) : loading && notifications.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#07da63" />
                <Text style={styles.loadingText}>Loading notifications...</Text>
              </View>
            ) : notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No Notifications</Text>
                <Text style={styles.emptyText}>
                  You're all caught up! We'll notify you when something new happens.
                </Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.notificationsList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#07da63']}
                    tintColor="#07da63"
                  />
                }
              >
                {notifications.map((notification) => (
                  <TouchableOpacity 
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.read && styles.unreadNotification
                    ]}
                    onPress={() => handleNotificationPress(notification)}
                  >
                    <View style={[
                      styles.notificationIconContainer,
                      { backgroundColor: notification.iconColor + '20' }
                    ]}>
                      <Ionicons 
                        name={notification.icon} 
                        size={24} 
                        color={notification.iconColor} 
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        {!notification.read && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Clear All Button */}
            {notifications.length > 0 && unreadCount > 0 && (
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.clearAllButton}
                  onPress={handleMarkAllAsRead}
                >
                  <Text style={styles.clearAllText}>Mark All as Read</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ordersTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ordersTab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e9f7ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersTabActive: {
    backgroundColor: '#07da63',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Raleway-Bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  headerBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshIconButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  notificationsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ededed',
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#07da63',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearAllButton: {
    backgroundColor: '#07da63',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearAllText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
  loginButton: {
    backgroundColor: '#07da63',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default BottomNavigation;