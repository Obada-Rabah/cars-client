import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { I18nManager } from 'react-native';
import API_BASE_URL from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingView, Platform } from 'react-native';


I18nManager.forceRTL(true);

export default function AddCarScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    model: '',
    year: '',
    used: true,
    describtion: '',
    price: '',
  });

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { model, year, describtion, price } = form;

    if (!model.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال الموديل');
      return false;
    }

    if (!year.trim() || isNaN(year)) {
      Alert.alert('خطأ', 'يرجى إدخال سنة صحيحة');
      return false;
    }

    if (!describtion.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال وصف السيارة');
      return false;
    }

    if (!price.trim() || isNaN(price)) {
      Alert.alert('خطأ', 'يرجى إدخال سعر صحيح (أرقام فقط)');
      return false;
    }

    return true;
  };


  const handleSubmit = async () => {
    try {
      if (!validateForm()) return; // Don't continue if validation fails

      console.log("Submit function started"); // Debug log

      const token = await AsyncStorage.getItem('userToken');
      console.log("Token:", token); // Verify token

      if (!token) {
        console.log("No token found");
        return;
      }

      console.log("Form data:", form); // Verify form data

      const response = await fetch(`${API_BASE_URL}/api/cars/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      console.log("Response status:", response.status); // Debug status

      const data = await response.json();
      console.log("Response data:", data); // Debug response

      if (!response.ok) throw new Error(data.message || 'Request failed');

      console.log("Success!"); // Final success log
      navigation.goBack();

    } catch (error) {
      console.error("Submit error:", error); // Detailed error
    }
  };


  const handlePress = () => {
    console.log("Button pressed, starting submit");
    handleSubmit().catch(e => console.error("Uncaught error:", e));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >

      <View style={{ flex: 1 }}>

        <Text style={styles.title}>إضافة سيارة جديدة</Text>

        <Text style={styles.inputLabel}>الموديل</Text>
        <TextInput
          style={styles.input}
          placeholder="مارسيدس , كيا..."
          placeholderTextColor="#dddcd7aa"
          value={form.model}
          onChangeText={(text) => handleChange('model', text)}
          textAlign={I18nManager.isRTL ? 'right' : 'left'}
        />

        <Text style={styles.inputLabel}>السنة</Text>
        <TextInput
          style={styles.input}
          placeholder="سنة التصنيع"
          placeholderTextColor="#dddcd7aa"
          value={form.year}
          onChangeText={(text) => handleChange('year', text)}
          textAlign={I18nManager.isRTL ? 'right' : 'left'}
        />

        <Text style={styles.inputLabel}>الحالة</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              form.used === false && styles.activeToggleButton
            ]}
            onPress={() => handleChange('used', false)}
          >
            <Text style={[
              styles.toggleButtonText,
              form.used === false && styles.activeToggleButtonText
            ]}>
              جديدة
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              form.used === true && styles.activeToggleButton
            ]}
            onPress={() => handleChange('used', true)}
          >
            <Text style={[
              styles.toggleButtonText,
              form.used === true && styles.activeToggleButtonText
            ]}>
              مستعملة
            </Text>
          </TouchableOpacity>

        </View>


        <Text style={styles.inputLabel}>الوصف</Text>
        <TextInput
          style={styles.input}
          placeholder="وصف السيارة"
          placeholderTextColor="#dddcd7aa"
          value={form.describtion}
          onChangeText={(text) => handleChange('describtion', text)}
          textAlign={I18nManager.isRTL ? 'right' : 'left'}
        />

        <Text style={styles.inputLabel}>السعر</Text>
        <TextInput
          style={styles.input}
          placeholder="أدخل السعر"
          placeholderTextColor="#dddcd7aa"
          value={form.price}
          keyboardType='numeric'
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, '');
            handleChange('price', numericValue);
          }}
          textAlign={I18nManager.isRTL ? 'right' : 'left'}
        />


        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>حفظ السيارة</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#133353',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#e3711a',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e3711a',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dddcd7',
    marginBottom: 8,
    marginRight: 5,
  },
  input: {
    height: 50,
    borderColor: '#e3711a',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(221, 220, 215, 0.1)',
    color: '#dddcd7',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#e3711a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitButtonText: {
    color: '#133353',
    fontWeight: '700',
    fontSize: 18,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },

  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3711a',
    alignItems: 'center',
    backgroundColor: 'rgba(221, 220, 215, 0.1)',
  },

  activeToggleButton: {
    backgroundColor: '#e3711a',
  },

  toggleButtonText: {
    color: '#dddcd7',
    fontWeight: '600',
    fontSize: 16,
  },

  activeToggleButtonText: {
    color: '#133353',
  },

});