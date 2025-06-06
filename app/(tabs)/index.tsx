import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.container}>
        <Text style={styles.title}>Scan & Save</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
          <Image
            source={require('@/assets/images/info-icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Centered Icons */}
      <View style={styles.iconLayout}>
        {/* Scan - Center */}
        <TouchableOpacity onPress={() => router.push('/scan')} style={styles.scanIcon}>
          <Image source={require('@/assets/images/iconScan.png')} style={styles.iconImageLarge} />
        </TouchableOpacity>

        {/* Cart - Top Right */}
        <TouchableOpacity
          onPress={() => router.push('/cart')}
          style={[styles.sideIcon, { transform: [{ translateX: 100 }, { translateY: -130 }] }]}
        >
          <Image source={require('@/assets/images/iconCart.png')} style={styles.iconImageMedium} />
        </TouchableOpacity>

        {/* Profile - Bottom Right (moved more top-right) */}
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={[styles.sideIcon, { transform: [{ translateX: 120 }, { translateY: 80 }] }]}
        >
          <Image source={require('@/assets/images/iconProfile.png')} style={styles.iconImageMedium} />
        </TouchableOpacity>

        {/* Search - Bottom Left */}
        <TouchableOpacity
          onPress={() => router.push('/search')}
          style={[styles.sideIcon, { transform: [{ translateX: -110 }, { translateY: 100 }] }]}
        >
          <Image source={require('@/assets/images/iconSearch.png')} style={styles.iconImageMedium} />
        </TouchableOpacity>
      </View>

      {/* Info Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Nalazite se na početnom zaslonu aplikacije Scan & Save. Ovdje možete pristupiti različitim dijelovima aplikacije pritiskom na jednu od narandžastih ikona.
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: -30,
  },
  scanIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sideIcon: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconImage: {
    width: 28,
    height: 28,
    tintColor: 'white',
  },
  iconImageMedium: {
    width: 36,
    height: 36,
    tintColor: 'white',
  },
  iconImageLarge: {
    width: 50,
    height: 50,
    tintColor: 'white',
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
  },
});
