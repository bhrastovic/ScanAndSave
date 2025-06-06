import { Tabs } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10, // 👈 Blago podignuto
          height: 70,
          borderTopWidth: 0,
          backgroundColor: '#fff',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: () => (
            <Image
              source={require('@/assets/images/homeNavIcon.png')}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: () => (
            <Image
              source={require('@/assets/images/searchNavIcon.png')}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '',
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as TouchableOpacityProps)}
              style={{
                top: -30,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 40,
                width: 70,
                height: 70,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 10,
              }}
            >
              <Image
                source={require('@/assets/images/mainScanIcon.png')}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: () => (
            <Image
              source={require('@/assets/images/profileNavIcon.png')}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '',
          tabBarIcon: () => (
            <Image
              source={require('@/assets/images/cartNavIcon.png')}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
