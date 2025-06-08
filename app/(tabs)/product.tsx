import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActionSheetIOS, Alert, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import products from '../../data/products_proba.json';

// SVG ikone
import BackIcon from '@/assets/images/backIcon.svg';
import InfoIcon from '@/assets/images/info-icon.svg';
import LocationIcon from '@/assets/images/locationIcon.svg';
import SortIcon from '@/assets/images/sortIcon.svg';

import KauflandLogo from '@/assets/images/kauflandLogo.svg';
import KonzumLogo from '@/assets/images/konzumLogo.svg';
import LidlLogo from '@/assets/images/lidlLogo.svg';
import PlodineLogo from '@/assets/images/plodineLogo.svg';
import SparLogo from '@/assets/images/sparLogo.svg';

export default function ProductScreen() {
  const router = useRouter();
  const { barcode } = useLocalSearchParams();
  const product = products.find((p) => p.barcode === barcode);

  const imageMap: Record<string, any> = {
    "dorinariza.png": require('@/assets/images/dorinariza.png')
  };

  const storeLogoMap: Record<string, React.FC<{ width?: number; height?: number }>> = {
    Kaufland: KauflandLogo,
    Konzum: KonzumLogo,
    Spar: SparLogo,
    Plodine: PlodineLogo,
    Lidl: LidlLogo,
  };

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [shopModalVisible, setShopModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [sortIndex, setSortIndex] = useState<number | null>(null);

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const handleCitySelect = () => {
    const cities = ['Zagreb', 'Split', 'Osijek', 'Rijeka', 'Prikaži sve'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: cities,
          cancelButtonIndex: cities.length - 1,
        },
        (index) => {
          setSelectedCity(index < 4 ? cities[index] : null);
        }
      );
    } else {
      Alert.alert('Odaberi grad', '', cities.map((city, index) => ({
        text: city,
        onPress: () => setSelectedCity(index < 4 ? city : null),
        style: index === 4 ? 'cancel' : 'default',
      })));
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
          if (buttonIndex !== cancelButtonIndex) setSortIndex(buttonIndex);
        }
      );
    } else {
      Alert.alert('Sortiraj prema', '', [
        { text: 'Po cijeni (uzlazno)', onPress: () => setSortIndex(0) },
        { text: 'Po cijeni (silazno)', onPress: () => setSortIndex(1) },
        { text: 'Abecedno', onPress: () => setSortIndex(2) },
        { text: 'Abecedno (obrnuto)', onPress: () => setSortIndex(3) },
        { text: 'Odustani', style: 'cancel', onPress: () => {} }
      ]);
    }
  };

  const filteredShops = useMemo(() => {
    if (!product) return [];

    let list = product.prices
      .filter((entry) => !selectedCity || entry.city === selectedCity)
      .map((entry) => ({
        name: entry.store,
        branch: entry.branch,
        current: entry.price.toFixed(2),
      }));

    switch (sortIndex) {
      case 0:
        list.sort((a, b) => parseFloat(a.current) - parseFloat(b.current));
        break;
      case 1:
        list.sort((a, b) => parseFloat(b.current) - parseFloat(a.current));
        break;
      case 2:
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 3:
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return list;
  }, [product, selectedCity, sortIndex]);

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16 }}>Proizvod nije pronađen.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: 'blue' }}>Vrati se natrag</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            source={product.image ? imageMap[product.image] : require('@/assets/images/default.jpg')}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDetail}>Gramaža: {product['gramaza:'] ?? '-'}</Text>
          <Text style={styles.productDetail}>Proizvođač: {product['proivodac']?.trim() || '-'}</Text>
          <Text style={styles.productDetail}>Barkod: {product.barcode}</Text>
        </View>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)} style={styles.iconButton}>
          <InfoIcon width={35} height={35} />
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Popis trgovina</Text>
        <View style={styles.listIcons}>
          <TouchableOpacity onPress={handleCitySelect} style={styles.iconButton}>
            <LocationIcon width={35} height={35} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSort} style={styles.iconButton}>
            <SortIcon width={35} height={35} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShopModalVisible(true)} style={styles.iconButton}>
            <InfoIcon width={35} height={35} />
          </TouchableOpacity>
        </View>
      </View>

      {filteredShops.map((shop, index) => {
        const LogoComponent = storeLogoMap[shop.name];
        return (
          <View key={index} style={styles.shopItem}>
            <View style={styles.shopNameContainer}>
              {LogoComponent ? (
                <LogoComponent width={70} height={25} />
              ) : (
                <Text style={styles.shopName}>{shop.name}</Text>
              )}
            </View>

            <View style={styles.priceBlockLeftAlignedSingle}>
              <Text style={styles.priceRowInline}>
                <Text style={styles.priceLabelOrange}>Trenutačna cijena: </Text>
                <Text style={styles.priceValueOrange}>{shop.current}€</Text>
              </Text>
              <Text style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
                {shop.branch}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => showToast('Proizvod dodan u košaricu!')}
            >
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>
        );
      })}

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
              Klikom na sort ikonu možete sortirati trgovine po cijeni ili abecedno. {"\n\n"}
              Klikom na plus ikonu dodajete proizvod u svoju košaricu.
            </Text>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 60, paddingBottom: 30 },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backText: { marginLeft: 8, fontSize: 16, color: '#000' },
  productSection: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 30, paddingHorizontal: 20 },
  imagePlaceholder: { width: 80, height: 80, backgroundColor: '#eee', borderWidth: 1, borderColor: '#aaa', marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontWeight: 'bold', fontSize: 20, marginBottom: 4 },
  productDetail: { fontSize: 14, color: '#444' },
  iconButton: { marginLeft: 6 },
  listHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  listTitle: { flex: 1, fontSize: 24, fontWeight: 'bold', color: '#000000' },
  listIcons: { flexDirection: 'row', alignItems: 'center' },
  shopItem: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#000', padding: 12, borderRadius: 8, marginBottom: 10, marginHorizontal: 20, justifyContent: 'space-between' },
  shopNameContainer: { flex: 1 },
  shopName: { fontWeight: 'bold' },
  priceBlockLeftAlignedSingle: { flex: 2, justifyContent: 'center', alignItems: 'flex-start' },
  priceLabelOrange: { fontSize: 12, color: 'orange' },
  priceValueOrange: { fontSize: 14, color: 'orange', fontWeight: 'bold' },
  priceRowInline: { flexDirection: 'row', alignItems: 'center' },
  circleButton: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  plus: { fontSize: 20, color: '#000', lineHeight: 22 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalView: { backgroundColor: 'white', padding: 20, borderRadius: 10, marginHorizontal: 40, alignItems: 'center', justifyContent: 'center' },
  modalText: { fontSize: 16, color: '#000', textAlign: 'center' },
});
