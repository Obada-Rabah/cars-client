import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../../config';


const ChatListScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(`${API_BASE_URL}/api/chat/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add if needed
        }
      });

      const text = await response.text();
      
      // Check if response is HTML (error)
      if (text.startsWith('<!DOCTYPE html>') || text.startsWith('<html')) {
        throw new Error('Server returned HTML. Check your API endpoint.');
      }

      const data = JSON.parse(text);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch chats');
      }

      const formattedChats = data.data.map(chat => ({
        id: chat.chatId.toString(),
        userId: chat.userId, // Include the userId
        name: `${chat.firstName} ${chat.lastName}`,
        lastMessage: chat.lastMessage,
        time: formatTime(chat.lastMessageTime),
        avatar: chat.image || 'https://randomuser.me/api/portraits/men/1.jpg', // Fallback avatar
        unread: chat.unreadCount
      }));

      setChats(formattedChats);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const navigateToChat = (chat) => {
    navigation.navigate('Chat', {
      recipientId: chat.userId, // Pass the userId here
      recipientName: chat.name
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#e3711a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#dddcd7" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Chat list */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#e3711a']}
            tintColor="#e3711a"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem}
            onPress={() => navigateToChat(item)}
            activeOpacity={0.8}
          >
            <Image 
              source={{ uri: '' }} 
              style={styles.avatar} 
            />
            
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              
              <View style={styles.chatFooter}>
                <Text 
                  style={[
                    styles.lastMessage,
                    item.unread > 0 && styles.unreadMessage
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.lastMessage}
                </Text>
                
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#133353',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e3711a',
    backgroundColor: '#133353',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#dddcd7',
  },
  listContainer: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(221, 220, 215, 0.1)',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(227, 113, 26, 0.2)',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#e3711a',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontWeight: '600',
    fontSize: 17,
    color: '#dddcd7',
  },
  time: {
    fontSize: 13,
    color: '#dddcd7aa',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    color: '#dddcd7aa',
    fontSize: 15,
    marginRight: 10,
  },
  unreadMessage: {
    color: '#dddcd7',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#e3711a',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#133353',
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  separator: {
    height: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    marginHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default ChatListScreen;