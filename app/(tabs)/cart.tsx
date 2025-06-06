import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const [expandedStores, setExpandedStores] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    '1': 1,
    '2': 1,
    '3': 1,
    '4': 1,
  });
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const toggleExpand = (store: string) => {
    setExpandedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const incrementQuantity = (productId: string) => {
    setQuantities((prev) => {
      const newQty = (prev[productId] ?? 0) + 1;
      return { ...prev, [productId]: newQty };
    });
  };

  const decrementQuantity = (productId: string) => {
    const currentQty = quantities[productId] ?? 1;
    if (currentQty === 1) {
      Alert.alert(
        'Upozorenje',
        'Ako smanjiš količinu na 0, proizvod će biti uklonjen iz košarice.',
        [
          { text: 'Odustani', style: 'cancel' },
          {
            text: 'Ukloni',
            onPress: () => {
              setQuantities((prev) => {
                const { [productId]: _, ...rest } = prev;
                return rest;
              });
            },
            style: 'destructive',
          },
        ]
      );
    } else {
      setQuantities((prev) => ({ ...prev, [productId]: currentQty - 1 }));
    }
  };

  const cartData = [
    {
      store: 'Konzum',
      products: [
        { id: '1', name: 'Kinder Bueno', price: 1.99 },
        { id: '2', name: 'Milka Oreo', price: 2.5 },
        { id: '3', name: 'Livanjski sir', price: 5.6 },
      ],
    },
    {
      store: 'Spar',
      products: [
        { id: '3', name: 'Čips paprika', price: 1.99 },
        { id: '4', name: 'Pepsi 2L', price: 2.99 },
      ],
    },
  ];

  const getStoreTotal = (products: { id: string; price: number }[]) => {
    return products.reduce((sum, product) => {
      const qty = quantities[product.id] ?? 0;
      return sum + qty * product.price;
    }, 0);
  };

  const filteredCartData = cartData
    .map((store) => {
      const filteredProducts = store.products.filter((p) => quantities[p.id] !== undefined);
      return { ...store, products: filteredProducts };
    })
    .filter((store) => store.products.length > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Košarica</Text>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)} style={styles.iconButton}>
          <Image
            source={require('@/assets/images/info-icon.png')}
            style={styles.infoIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredCartData.map((store) => {
          const isExpanded = expandedStores.includes(store.store);
          const storeTotal = getStoreTotal(store.products).toFixed(2);

          return (
            <View key={store.store} style={styles.storeContainer}>
              <View style={styles.storeHeaderWrapper}>
                <View style={styles.storeHeaderRow}>
                  <View style={styles.storeHeader}>
                    <Text style={styles.storeName}>{store.store}</Text>
                    <Text style={styles.storeTotal}>{storeTotal}€</Text>
                  </View>
                </View>
              </View>

              {isExpanded && (
                <View>
                  <View style={styles.productsList}>
                    {store.products.map((product) => {
                      const quantity = quantities[product.id] ?? 0;
                      const price = quantity * product.price;

                      return (
                        <View key={product.id} style={styles.productItem}>
                          <View style={styles.quantityControls}>
                            <TouchableOpacity onPress={() => decrementQuantity(product.id)}>
                              <Image
                                source={require('@/assets/images/minus-circle.png')}
                                style={styles.iconButton}
                              />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={() => incrementQuantity(product.id)}>
                              <Image
                                source={require('@/assets/images/plus-circle.png')}
                                style={styles.iconButton}
                              />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.productName}>{product.name}</Text>
                          <Text style={styles.productPrice}>{price.toFixed(2)}€</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              <TouchableOpacity 
                onPress={() => toggleExpand(store.store)} 
                style={styles.expandButtonBottom}>
                <Image
                  source={require('@/assets/images/menu.png')}
                  style={styles.expandIcon}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <Modal transparent visible={infoModalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setInfoModalVisible(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ovdje možete pregledati proizvode koje ste dodali u košaricu. Klikom na ikonu možete proširiti prikaz proizvoda po trgovini i prilagoditi količinu svakog proizvoda. Kada količina dosegne nulu, proizvod će automatski biti uklonjen iz prikaza.
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  storeContainer: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    marginBottom: 20,
    position: 'relative',
    paddingBottom: 36,
  },
  storeHeaderWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  storeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  storeTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  expandButtonBottom: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -12,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 20,
    zIndex: 10,
    transform: [{ translateX: -12 }, { translateY: 12 }],
  },
  expandIcon: {
    width: 24,
    height: 24,
  },
  productsList: {
    marginTop: 16,
    gap: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  productName: {
    fontSize: 16,
    color: '#000',
    flex: 2,
    textAlign: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-start',
  },
  iconButton: {
    width: 32,
    height: 32,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '500',
    width: 32,
    textAlign: 'center',
    color: '#000',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    color: '#000',
  },
  infoIcon: {
    width: 22,
    height: 22,
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
