import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../../config'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



export default function CarsScreen() {
  const navigation = useNavigation();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');


  useFocusEffect(
    useCallback(() => {
      const fetchCars = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/api/cars/cars`);
          const data = await response.json();
          setCars(data);
          setFilteredCars(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching cars: ', error);
          setLoading(false);
        }
      };
  
      fetchCars();
    }, [])
  );
  

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter(car => 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.year.toString().includes(searchQuery) ||
        car.price.toString().includes(searchQuery) ||
        car.user.name.toLowerCase().includes(searchQuery.toLowerCase()) 
      );
      setFilteredCars(filtered);
    }
  }, [searchQuery, cars]);

  const handleAddCar = () => {
    navigation.navigate('AddCar');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CarDetail', { carId: item.id })}
    >
      <Image source={{ uri: "https://www.pexels.com/photo/black-rubber-mercedes-benz-automotive-wheel-195635/" }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.model}</Text>
        <Text style={styles.year}>{item.year}</Text>
        <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        <TouchableOpacity
          style={styles.userContainer}
        >
          <Image source={{ uri: "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg" }} style={styles.userAvatar} />
          <Text style={styles.userName}>{item.userName}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading cars...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Cars</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCar}>
          <Text style={styles.addButtonText}>Add Car</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cars..."
          placeholderTextColor="#dddcd7"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      <FlatList
        data={filteredCars}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cars found matching your search</Text>
          </View>
        }
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#133353',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#133353',
    borderBottomWidth: 1,
    borderBottomColor: '#e3711a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#dddcd7',
  },
  addButton: {
    backgroundColor: '#e3711a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
  },
  addButtonText: {
    color: '#133353',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: '#133353',
    padding: 12,
  },
  searchInput: {
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddcd7',
    backgroundColor: 'rgba(221, 220, 215, 0.1)',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#dddcd7',
  },
  list: {
    padding: 12,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'rgba(221, 220, 215, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(227, 113, 26, 0.3)',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#dddcd7',
    marginBottom: 6,
  },
  year: {
    fontSize: 16,
    color: '#dddcd7',
    marginBottom: 8,
    opacity: 0.8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e3711a',
    marginBottom: 8,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(221, 220, 215, 0.2)',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e3711a',
  },
  userName: {
    fontSize: 16,
    color: '#dddcd7',
    opacity: 0.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    color: '#dddcd7',
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingText: {
    fontSize: 18,
    color: '#dddcd7',
    textAlign: 'center',
    marginTop: 20,
  },
});