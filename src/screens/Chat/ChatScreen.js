import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import API_BASE_URL from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';




const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipientId, recipientName } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);


  const socket = io(API_BASE_URL, {
    transports: ['websocket'],
    withCredentials: true,
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('userToken');
  
        const response = await fetch(`${API_BASE_URL}/api/chat/${recipientId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        const userName = data.data.sender
  
        if (data.success) {
          const formattedMessages = data.data.map((message) => ({
            id: message.id.toString(),
            text: message.content,
            sender: message.senderId === recipientId ? recipientId : 'me',
            time: new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
  
          setMessages(formattedMessages);
        } else {
          console.error('Failed to load messages');
          setError('Failed to load messages');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
  
    // Call the function initially
    fetchMessages();
  
    // Set the interval to refresh every 6 seconds
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 6000);
  
    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, [recipientId]); // Depend on recipientId to refetch when it changes
  




  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const tempId = Date.now().toString();
    const newMsg = {
      id: tempId,
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');

    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add if needed
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: recipientId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Replace temp message with actual one
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                id: data.data.id.toString(),
                text: data.data.content,
                sender: 'me',
                time: new Date(data.data.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
              : msg
          )
        );
      } else {
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        setError('Failed to send message');
      }
    } catch (err) {
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setError(err.message || 'Failed to send message');
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const navigateToUserProfile = () => {
    navigation.navigate('UserProfile', {
      userId: recipientId,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#e3711a" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#dddcd7" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfoContainer}
          onPress={navigateToUserProfile}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: 'https://placekitten.com/200/200' }}
            style={styles.userAvatar}
          />

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{recipientName}</Text>
            <Text style={styles.userStatus}>Online</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingContainer}
          keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.sender === 'me' ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.sender === 'me' && styles.myMessageText,
                  ]}
                >
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    item.sender === 'me' && styles.myMessageTime,
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            )}
            ListFooterComponent={<View style={styles.listFooter} />}
          />

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                placeholderTextColor="#dddcd7aa"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={newMessage.trim() ? '#e3711a' : '#dddcd755'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#133353'
  },
  contentContainer: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e3711a',
    backgroundColor: '#133353',
  },
  backButton: { padding: 5, marginRight: 10 },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#e3711a',
    marginRight: 15,
  },
  userInfo: { flex: 1 },
  userName: { fontWeight: '600', fontSize: 18, color: '#dddcd7' },
  userStatus: { fontSize: 13, color: '#dddcd7aa' },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  messagesList: {
    padding: 20,
    paddingBottom: 80, // Extra space for input container
  },
  listFooter: {
    height: 10, // Extra space at the bottom of the list
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e3711a',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(221, 220, 215, 0.2)',
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 16, color: '#dddcd7', lineHeight: 22 },
  myMessageText: { color: '#133353' },
  messageTime: {
    fontSize: 11,
    color: '#dddcd7aa',
    marginTop: 6,
    textAlign: 'right',
  },
  myMessageTime: { color: '#133353aa' },
  inputWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: '#133353',
    borderTopWidth: 2,
    borderTopColor: '#e3711a',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(221, 220, 215, 0.1)',
    borderRadius: 24,
    marginRight: 10,
    color: '#dddcd7',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e3711a55',
  },
  sendButton: { padding: 8 },
});
export default ChatScreen;
