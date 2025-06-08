import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CartScreen() {
  const [items, setItems] = useState<
    { name: string; barcode: string; branch: string; store: string; price: number; image: string }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const loadCart = async () => {
        const stored = await AsyncStorage.getItem('products');
        if (!stored) return;

        const parsed = JSON.parse(stored);
        const cartItems: {
          name: string;
          barcode: string;
          branch: string;
          store: string;
          price: number;
          image: string;
        }[] = [];

        for (const product of parsed) {
          for (const price of product.prices) {
            if (price.dodano) {
              cartItems.push({
                name: product.name,
                barcode: product.barcode,
                branch: price.branch,
                store: price.store,
                price: price.price,
                image: product.image,
              });
            }
          }
        }

        setItems(cartItems);
      };

      loadCart();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Košarica</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.shopItem}>
          <View style={styles.shopNameContainer}>
            <Text style={styles.shopName}>{item.store}</Text>
          </View>
          <View style={styles.priceBlockLeftAlignedSingle}>
            <Text style={styles.priceRowInline}>
              <Text style={styles.priceLabelOrange}>Trenutačna cijena: </Text>
              <Text style={styles.priceValueOrange}>{item.price.toFixed(2)}€</Text>
            </Text>
            <Text style={styles.branchText}>{item.branch}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  shopNameContainer: {
    flex: 1,
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  priceBlockLeftAlignedSingle: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  priceLabelOrange: {
    fontSize: 12,
    color: 'orange',
  },
  priceValueOrange: {
    fontSize: 14,
    color: 'orange',
    fontWeight: 'bold',
  },
  priceRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  branchText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
});
