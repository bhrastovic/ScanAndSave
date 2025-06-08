import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import InfoIcon from '@/assets/images/info-icon.svg';
import KauflandLogo from '@/assets/images/kauflandLogo.svg';
import KonzumLogo from '@/assets/images/konzumLogo.svg';
import LidlLogo from '@/assets/images/lidlLogo.svg';
import PlodineLogo from '@/assets/images/plodineLogo.svg';
import SparLogo from '@/assets/images/sparLogo.svg';

import products from '../../data/products_proba.json';

const storeLogoMap: { [key: string]: React.FC<{ width?: number; height?: number }> } = {
  Kaufland: KauflandLogo,
  Konzum: KonzumLogo,
  Lidl: LidlLogo,
  Plodine: PlodineLogo,
  Spar: SparLogo,
};

export default function CartScreen() {
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const addedPrices = products.flatMap((product) =>
    product.prices.map((p) => ({
      store: p.store,
      price: p.price,
    }))
  );

  const storeTotals: { [key: string]: number } = {};

  addedPrices.forEach(({ store, price }) => {
    storeTotals[store] = (storeTotals[store] ?? 0) + price;
  });

  if (!storeTotals['Plodine']) {
    storeTotals['Plodine'] = 12.5;
  }

  const storeOrder = ['Kaufland', 'Konzum', 'Lidl', 'Plodine', 'Spar'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Košarica</Text>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
          <InfoIcon width={35} height={35} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {storeOrder.map((store) => {
          const totalToShow = storeTotals[store];
          if (!totalToShow) return null;
          const Logo = storeLogoMap[store];
          return (
            <View key={store} style={styles.storeContainer}>
              <View style={styles.logoRow}>
                {Logo && <Logo width={100} height={35} />}
              </View>
              <Text style={styles.totalLabel}>Ukupna cijena</Text>
              <Text style={styles.totalValue}>{totalToShow.toFixed(2)}€</Text>
            </View>
          );
        })}
      </ScrollView>

      <Modal transparent visible={infoModalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setInfoModalVisible(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ova funkcionalnost dolazi uskoro.
            </Text>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  storeContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoRow: {
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
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
    textAlign: 'center',
  },
});
