// src/navigation/ProviderStack.js
import { createStackNavigator } from '@react-navigation/stack';
import ProvidersScreen from '../screens/providers/ProvidersScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ProviderScreen from '../screens/providers/ProviderScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import ChatListScreen from '../screens/Chat/ChatListScreen';

const Stack = createStackNavigator();

export default function ProviderStack({ navigation, route }) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);

    if (routeName === 'ProviderDetail' || routeName === 'Chat') {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProvidersScreen"
        component={ProvidersScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ProviderDetail"
        component={ProviderScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          headerShown: true, // Enable header
          headerStyle: {
            backgroundColor: '#133353',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#dddcd7" />
            </TouchableOpacity>
          ),
          headerTitle: () => null, // Optional: Hide the default title
        }}
      />

    </Stack.Navigator>
  );
}