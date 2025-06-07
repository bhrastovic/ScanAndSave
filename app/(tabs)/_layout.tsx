import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

// SVG ikone
import NavIconCart from '@/assets/images/navIconCart.svg';
import NavIconHome from '@/assets/images/navIconHome.svg';
import NavIconProfile from '@/assets/images/navIconProfile.svg';
import NavIconScan from '@/assets/images/navIconScan.svg';
import NavIconSearch from '@/assets/images/navIconSearch.svg';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
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
          tabBarIcon: () => <NavIconHome width={24} height={24} />, 
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: () => <NavIconSearch width={24} height={24} />, 
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
              <NavIconScan width={40} height={40} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: () => <NavIconProfile width={24} height={24} />, 
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '',
          tabBarIcon: () => <NavIconCart width={24} height={24} />, 
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
