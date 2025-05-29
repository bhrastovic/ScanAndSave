import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProductScreen() {
  const router = useRouter();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [shopModalVisible, setShopModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('');

  const [shops, setShops] = useState([
    { name: 'Trgovina 1', current: '9.99', lowest: '9.70' },
    { name: 'Trgovina 2', current: '10.20', lowest: '9.90' },
    { name: 'Trgovina 3', current: '10.50', lowest: '10.20' },
    { name: 'Trgovina 4', current: '11.00', lowest: '8.70' },
    { name: 'Trgovina 5', current: '12.41', lowest: '9.50' },
  ]);

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const handleSort = () => {
    const options = [
      'Po cijeni (uzlazno)',
      'Po cijeni (silazno)',
      'Abecedno',
      'Abecedno (obrnuto)',
      'Odustani',
    ];
    const cancelButtonIndex = 4;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          applySort(buttonIndex);
        }
      );
    } else {
      Alert.alert('Sortiraj prema', '', [
        { text: options[0], onPress: () => applySort(0) },
        { text: options[1], onPress: () => applySort(1) },
        { text: options[2], onPress: () => applySort(2) },
        { text: options[3], onPress: () => applySort(3) },
        { text: options[4], style: 'cancel' },
      ]);
    }
  };

  const applySort = (index: number) => {
    let sorted = [...shops];
    switch (index) {
      case 0:
        sorted.sort((a, b) => parseFloat(a.current) - parseFloat(b.current));
        break;
      case 1:
        sorted.sort((a, b) => parseFloat(b.current) - parseFloat(a.current));
        break;
      case 2:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 3:
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    setShops(sorted);
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.push('/scan')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Natrag</Text>
      </TouchableOpacity>

      <View style={styles.productSection}>
        <View style={styles.imagePlaceholder} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>IME PROIZVODA</Text>
          <Text style={styles.productDetail}>Gramaža</Text>
          <Text style={styles.productDetail}>Proizvođač</Text>
          <Text style={styles.productDetail}>Barkod</Text>
        </View>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)} style={styles.iconButton}>
          <Image source={require('@/assets/images/info-icon.png')} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Popis trgovina</Text>
        <View style={styles.listIcons}>
          <TouchableOpacity onPress={handleSort} style={styles.iconButton}>
            <Ionicons name="swap-vertical" size={20} color="orange" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShopModalVisible(true)} style={styles.iconButton}>
            <Image source={require('@/assets/images/info-icon.png')} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      {shops.map((shop, index) => (
        <View key={index} style={styles.shopItem}>
          <View style={styles.shopNameContainer}>
            <Text style={styles.shopName}>{shop.name}</Text>
          </View>

          <View style={styles.priceBlockLeftAligned}>
            <View style={styles.priceRowInline}>
              <Text style={styles.priceLabelOrange}>Trenutačna cijena:</Text>
              <Text style={styles.priceValueOrange}>{shop.current}€</Text>
            </View>
            <View style={styles.priceRowInline}>
              <Text style={styles.priceLabel}>Najniža cijena:</Text>
              <Text style={styles.priceValue}>{shop.lowest}€</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => showToast('Proizvod dodan u košaricu!')}
          >
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal transparent visible={infoModalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setInfoModalVisible(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ovdje se prikazuju osnovne informacije o proizvodu koji ste skenirali.
            </Text>
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={shopModalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShopModalVisible(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Cijene prikazuju trenutnu i najnižu zabilježenu cijenu po trgovini.
            </Text>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  productSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  productDetail: {
    fontSize: 14,
    color: '#444',
  },
  iconButton: {
    padding: 5,
    marginLeft: 6,
  },
  icon: {
    width: 20,
    height: 20,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  listTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  listIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
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
  },
  priceBlockLeftAligned: {
    flex: 2,
    justifyContent: 'center',
  },
  priceRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  priceValue: {
    marginLeft: 6,
    fontSize: 14,
  },
  priceLabelOrange: {
    fontSize: 12,
    color: 'orange',
  },
  priceValueOrange: {
    marginLeft: 6,
    fontSize: 14,
    color: 'orange',
    fontWeight: 'bold',
  },
  circleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: 20,
    color: '#888',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 40,
  },
  modalText: {
    fontSize: 16,
    color: '#000',
  },
});
