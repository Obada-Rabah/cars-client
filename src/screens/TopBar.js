import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AppHeader = () => {
  const navigation = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample notification data
  const notifications = [
    { id: '1', title: 'New message', text: 'You have a new message from John', time: '2 min ago' },
    { id: '2', title: 'Order update', text: 'Your order #12345 has been shipped', time: '1 hour ago' },
    { id: '3', title: 'Promotion', text: 'Special 20% off for your next purchase', time: '3 hours ago' },
    { id: '4', title: 'New message', text: 'You have a new message from John', time: '2 min ago' },
    { id: '5', title: 'Order update', text: 'Your order #12345 has been shipped', time: '1 hour ago' },
    { id: '6', title: 'Promotion', text: 'Special 20% off for your next purchase', time: '3 hours ago' },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClearAll = () => {
    setShowNotifications(false);
  };

  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <Image 
        source={require('../../assets/logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      
      {/* Spacer */}
      <View style={styles.spacer} />
      
      {/* Icons */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={toggleNotifications}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={28} color="#dddcd7" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications.length}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('ChatList')}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#dddcd7" />
        </TouchableOpacity>
      </View>

      {/* Notification Popup */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="fade"
        onRequestClose={toggleNotifications}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={toggleNotifications}
        >
          <View style={styles.notificationPopup}>
            {/* Popup Header with Close Button */}
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>Notifications</Text>
              <TouchableOpacity 
                onPress={toggleNotifications}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <Ionicons name="close" size={24} color="#dddcd7" />
              </TouchableOpacity>
            </View>
            
            {/* Notification List */}
            <ScrollView 
              style={styles.notificationList}
              contentContainerStyle={styles.notificationListContent}
            >
              {notifications.map(notification => (
                <TouchableOpacity 
                  key={notification.id} 
                  style={styles.notificationItem}
                  onPress={() => {
                    setShowNotifications(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationText}>{notification.text}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Clear All Button */}
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={handleClearAll}
              activeOpacity={0.8}
            >
              <Text style={styles.clearAllText}>Clear All Notifications</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#133353',
    borderBottomWidth: 2,
    borderBottomColor: '#e3711a',
    height: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  logo: {
    width: 150,
    height: 50,
    tintColor: '#dddcd7', // Optional: if you want the logo to match the theme
  },
  spacer: {
    flex: 1,
  },
  iconsContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 25,
    marginBottom: 5,
  },
  iconButton: {
    padding: 6,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    left: -3,
    backgroundColor: '#e3711a',
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#133353',
  },
  badgeText: {
    color: '#133353',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(19, 51, 83, 0.9)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  notificationPopup: {
    backgroundColor: '#133353',
    marginHorizontal: 20,
    borderRadius: 12,
    maxHeight: '70%',
    borderWidth: 2,
    borderColor: '#e3711a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221, 220, 215, 0.2)',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dddcd7',
  },
  notificationList: {
    paddingHorizontal: 15,
  },
  notificationItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221, 220, 215, 0.1)',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 3,
    color: '#dddcd7',
  },
  notificationText: {
    color: '#dddcd7aa',
    marginBottom: 3,
  },
  notificationTime: {
    fontSize: 12,
    color: '#dddcd777',
  },
  clearAllButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(221, 220, 215, 0.2)',
  },
  clearAllText: {
    color: '#e3711a',
    fontWeight: '600',
  },
});

export default AppHeader;