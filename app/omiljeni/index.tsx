import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Product = {
  id: number;
  name: string;
  barcode: string;
  borderColor: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Lay's Čips Paprika Maxx",
    barcode: '5 900259 128966',
    borderColor: '#FFD700', // zlatna
  },
  {
    id: 2,
    name: 'Domaćica Original 300 g',
    barcode: '3 850102 314126',
    borderColor: '#C0C0C0', // srebrna
  },
  {
    id: 3,
    name: 'Poli Classic 500 g',
    barcode: '3 838977 014051',
    borderColor: '#CD7F32', // brončana
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Omiljeni proizvodi</Text>
        </View>

        <View style={styles.subHeader}>
          <Text style={styles.subTitle}>Najčešće skenirani proizvodi</Text>
          <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        {products.map((item) => (
          <View key={item.id} style={styles.productRow}>
            <View style={[styles.imageBox, { borderColor: item.borderColor }]}>
              <Text style={styles.imageText}>image</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.barcode}>{item.barcode}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal transparent visible={infoModalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setInfoModalVisible(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ovdje su prikazana vaša tri najčešće skenirana proizvoda.
            </Text>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 24,
    paddingBottom: 80,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    marginRight: 12,
  },
  backIcon: {
    fontSize: 22,
    color: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  infoIcon: {
    fontSize: 18,
    color: '#f90',
    paddingLeft: 8,
  },
  spacer: {
    height: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  imageText: {
    fontSize: 12,
    color: '#fff',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  barcode: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
