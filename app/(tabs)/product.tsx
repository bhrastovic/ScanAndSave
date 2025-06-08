import { useLocalSearchParams, useRouter } from 'expo-router';
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
import products from '../../data/products_proba.json';

// SVG ikone
import BackIcon from '@/assets/images/backIcon.svg';
import InfoIcon from '@/assets/images/info-icon.svg';
import SortIcon from '@/assets/images/sortIcon.svg';

export default function ProductScreen() {
  const router = useRouter();
  const { barcode } = useLocalSearchParams();
  const product = products.find((p) => p.barcode === barcode);

  if(!product) {
  return (
  <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
    <Text style={{ fontSize: 16 }}>Proizvod nije pronađen.</Text>
    <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
      <Text style={{ color: 'blue' }}>Vrati se natrag</Text>
    </TouchableOpacity>
  </View>
  );
}

const imageMap: Record<string,any> = {
  "domacica.jpeg": require('@/assets/images/domacica.jpeg'),
  "KinderJaje.jpg": require('@/assets/images/KinderJaje.jpg'),
  "CocaCola.jpg": require('@/assets/images/CocaCola.jpg'),
  "RioMare.png": require('@/assets/images/RioMare.png'),
  "PoliSalama.jpeg": require('@/assets/images/PoliSalama.jpeg'),
  "Dorina.jpeg": require('@/assets/images/Dorina.jpeg'),
  "Barcaffe.jpeg": require('@/assets/images/Barcaffe.jpeg'),
  "nutella.jpeg": require('@/assets/images/nutella.jpeg'),
  "Jana.jpeg": require('@/assets/images/Jana.jpeg'),
  "LaysMaxx.jpeg": require('@/assets/images/LaysMaxx.jpeg'),


};

const [infoModalVisible, setInfoModalVisible] = useState(false);
const [shopModalVisible, setShopModalVisible] = useState(false);
const [sortOption, setSortOption] = useState('');
const [shops, setShops] = useState(() =>
  Object.entries(product.prices).map(([name, price]) => ({
    name,
    current: price?.toFixed(2) ?? '-',
    lowest: price?.toFixed(2) ?? '-',
  }))
);

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
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/scan', params: { clearManualInput: 'true' } })}
        style={styles.backButton}
      >
        <BackIcon width={35} height={35} />
        <Text style={styles.backText}>POVRATAK</Text>
      </TouchableOpacity>

      <View style={styles.productSection}>
        <View style={styles.imagePlaceholder}>
          <Image
            source={
              product.image
              ? imageMap[product.image.split('/').pop() ?? ''] 
              : require('@/assets/images/default.jpg')
            }
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDetail}>Gramaža:</Text>
          <Text style={styles.productDetail}>Proizvođač:</Text>
          <Text style={styles.productDetail}>{product.barcode}</Text>
        </View>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)} style={styles.iconButton}>
          <InfoIcon width={35} height={35} />
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Popis trgovina</Text>
        <View style={styles.listIcons}>
          <TouchableOpacity onPress={handleSort} style={styles.iconButton}>
            <SortIcon width={35} height={35} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShopModalVisible(true)} style={styles.iconButton}>
            <InfoIcon width={35} height={35} />
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
              Cijene prikazuju trenutnu i najnižu zabilježenu cijenu po trgovini.{"\n\n"}
              Klikom na lijevu sort ikonu možete sortirati trgovine po cijeni ili abecedno. {"\n\n"}
              Klikom na plus ikonu dodajete proizvod u svoju košaricu.
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
    color: '#000',
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
    marginLeft: 6,
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
  },
  priceBlockLeftAligned: {
    flex: 2,
    justifyContent: 'center',
    borderRadius: 6,
    padding: 8,
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
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: 20,
    color: '#000',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});
