import InfoIcon from '@/assets/images/info-icon.svg';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import rawProducts from '../../data/products_proba.json';

// Tip za proizvod
type Product = {
  name: string;
  barcode: string;
  image: string;
  prices: {
    [store: string]: number | null;
  };
};

// Sigurno pretvori JSON u tipizirani niz
const products = rawProducts as unknown as Product[];

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(true);

  const router = useRouter();
  const params = useLocalSearchParams();
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      if (params.clearManualInput === 'true') {
        setInputEnabled(false);
        setManualInput('');
        setHasScanned(false);

        setTimeout(() => {
          Keyboard.dismiss();
          inputRef.current?.blur();
          setInputEnabled(true);
        }, 300);
      } else {
        setHasScanned(false);
      }
    }, [params.clearManualInput])
  );

  const findProductByBarcode = (barcode: string): Product | undefined => {
    return products.find((product) => product.barcode.includes(barcode));
  };

  const handleNavigate = (barcode: string) => {
    const product = findProductByBarcode(barcode);

    if (product) {
      setHasScanned(true);
      router.push({
        pathname: '/product',
        params: { barcode: product.barcode },
      });
    } else {
      alert('Proizvod nije pronađen.');
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!hasScanned) {
      setHasScanned(true);
      const product = findProductByBarcode(data);

      if (product) {
        router.push({
          pathname: '/product',
          params: { barcode: product.barcode },
        });
      } else {
        alert('Proizvod nije pronađen.');
        setTimeout(() => setHasScanned(false), 1500); // resetiraj za novo skeniranje
      }
    }
  };

  const handleManualChange = (text: string) => {
    if (text.length <= 13) setManualInput(text);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim().length === 0) {
      alert('Unesi barkod.');
      return;
    }

    handleNavigate(manualInput.trim());
  };

  if (!permission) {
    return <Text>Učitavanje dozvola...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>Nemaš dozvolu za pristup kameri</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.link}>Daj dozvolu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Skeniranje</Text>
          <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
            <InfoIcon width={35} height={35} />
          </TouchableOpacity>
        </View>

        {/* Camera */}
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
            onBarcodeScanned={hasScanned ? undefined : handleBarCodeScanned}
          />
        </View>

        {/* Manual Entry */}
        <View style={styles.manualEntryContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Ručni unos</Text>
            <TouchableOpacity onPress={() => setManualModalVisible(true)}>
              <InfoIcon width={35} height={35} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              editable={inputEnabled}
              placeholder="Unesi barkod"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={13}
              value={manualInput}
              onChangeText={handleManualChange}
              style={styles.input}
            />
            <Text style={styles.note}>Barkod može imati najviše 13 znamenki</Text>

            <TouchableOpacity style={styles.button} onPress={handleManualSubmit}>
              <Text style={styles.buttonText}>Pretraži proizvod</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Modals */}
        <Modal transparent visible={infoModalVisible} animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setInfoModalVisible(false)}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Ovdje možeš skenirati barkod proizvoda koristeći kameru.
              </Text>
            </View>
          </Pressable>
        </Modal>

        <Modal transparent visible={manualModalVisible} animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setManualModalVisible(false)}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Ako ne možeš skenirati, unesi barkod ručno u polje ispod.
              </Text>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
  },
  scannerContainer: {
    height: 300,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
  },
  manualEntryContainer: {
    marginTop: 20,
  },
  inputWrapper: {
    paddingHorizontal: 20,
  },
  input: {
    height: 45,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    color: '#000',
  },
  note: {
    fontSize: 12,
    color: '#555',
    marginTop: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#ff7f00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    marginTop: 10,
    color: 'blue',
    fontWeight: 'bold',
  },
});
