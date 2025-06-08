import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

// SVG ikone
import NavIconCart from '@/assets/images/navIconCart.svg';
import NavIconCartActive from '@/assets/images/navIconCartActive.svg';
import NavIconHome from '@/assets/images/navIconHome.svg';
import NavIconProfile from '@/assets/images/navIconProfile.svg';
import NavIconProfileActive from '@/assets/images/navIconProfileActive.svg';
import NavIconScan from '@/assets/images/navIconScan.svg';
import NavIconSearch from '@/assets/images/navIconSearch.svg';
import NavIconSearchActive from '@/assets/images/navIconSearchActive.svg';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
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
            <View style={{ marginLeft: 12 }}>
              <NavIconHome width={28} height={28} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginLeft: -12 }}>
              {focused ? (
                <NavIconSearchActive width={28} height={28} />
              ) : (
                <NavIconSearch width={28} height={28} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '',
          tabBarIcon: () => (
            <View
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 5,
                backgroundColor: 'transparent',
                borderRadius: 75,
              }}
            >
              <NavIconScan width={150} height={150} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginLeft: 12 }}>
              {focused ? (
                <NavIconProfileActive width={28} height={28} />
              ) : (
                <NavIconProfile width={28} height={28} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginLeft: -12 }}>
              {focused ? (
                <NavIconCartActive width={28} height={28} />
              ) : (
                <NavIconCart width={28} height={28} />
              )}
            </View>
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