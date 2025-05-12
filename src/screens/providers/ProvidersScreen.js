import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import API_BASE_URL from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProviderScreen({ navigation }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_BASE_URL}/api/providers/providers`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch providers');
        
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const renderProviderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.providerCard}
      onPress={() => navigation.navigate('ProviderDetail', { providerId: item.id })}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS5JKkEsOUjRTx488XWzep59wkmMOohNrLKQ&s' }} 
        style={styles.providerImage} 
      />
      <View style={styles.providerInfo}>
        <Text style={styles.providerName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.providerLocation}>
          📍 {item.location || 'Location not specified'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading service providers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Service Providers</Text>
      <FlatList
        data={providers}
        renderItem={renderProviderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#133353',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 15,
    color: '#dddcd7',
    borderBottomWidth: 2,
    borderBottomColor: '#e3711a',
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#dddcd7',
  },
  listContainer: {
    paddingBottom: 20,
  },
  providerCard: {
    backgroundColor: 'rgba(221, 220, 215, 0.1)',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(227, 113, 26, 0.2)',
  },
  providerImage: {
    width: 100,
    height: 100,
    borderRightWidth: 1,
    borderRightColor: 'rgba(227, 113, 26, 0.2)',
  },
  providerInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dddcd7',
    marginBottom: 5,
  },
  providerLocation: {
    fontSize: 14,
    color: '#e3711a',
  },
});