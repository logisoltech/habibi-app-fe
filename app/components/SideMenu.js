import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function SideMenu({ isVisible, onClose, userName = 'User' }) {
  const router = useRouter();

  const menuItems = [
    {
      id: 'myorders',
      title: 'My Orders',
      icon: 'calendar-outline',
      route: '/orderhistory',
    },
    {
      id: 'bmi',
      title: 'BMI',
      icon: 'document-text-outline',
      route: '/bmi',
    },
    {
      id: 'feedback',
      title: 'Feedback',
      icon: 'chatbubble-outline',
      route: '/feedback',
    },
    {
      id: 'share',
      title: 'Share Transformation',
      icon: 'share-outline',
      route: '/share',
    },
    // {
    //   id: 'review',
    //   title: 'Leave a Review',
    //   icon: 'chatbubble-outline',
    //   route: '/review',
    // },
    // {
    //   id: 'settings',
    //   title: 'Settings',
    //   icon: 'settings-outline',
    //   route: '/settings',
    // },
  ];

  const handleMenuPress = (route) => {
    onClose();
    // Add fromHome parameter when navigating to BMI from home
    if (route === '/bmi') {
      router.push('/bmi?fromHome=true');
    } else {
      router.push(route);
    }
  };

  const handleLogout = () => {
    onClose();
    // Add logout logic here
    console.log('Logout pressed');
  };

  return (
    <Modal
      visible={isVisible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.menuContainer}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        {/* User Profile */}
        <View style={styles.userProfile}>
          <View style={styles.avatarContainer}> 
            <Text style={styles.avatarEmoji}>👋</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </View> 

        {/* Menu Items */}
        <View style={styles.menuItems}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.route)}
            >
              <Ionicons name={item.icon} size={20} color="#333" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  userProfile: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f7f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Raleway-Bold',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontFamily: 'Raleway-Regular',
  },
  logoutButton: {
    backgroundColor: '#07da63',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway-Bold',
  },
});

export default SideMenu;