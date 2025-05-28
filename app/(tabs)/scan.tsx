import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);

  const router = useRouter();

  const handleNavigate = () => {
    setHasScanned(true);
    router.push('/product');
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!hasScanned) {
      handleNavigate();
    }
  };

  const handleManualSubmit = () => {
    Keyboard.dismiss();
    if (manualInput.length === 13) {
      handleNavigate();
    } else {
      alert('Barkod mora imati 13 znamenki');
    }
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Skeniranje</Text>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)} style={styles.iconButton}>
          <Image
            source={require('@/assets/images/info-icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Camera */}
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13'],
          }}
          onBarcodeScanned={hasScanned ? undefined : handleBarCodeScanned}
        />
      </View>

      {/* Manual Entry */}
      <View style={styles.manualEntryContainer}>
        <View style={styles.header}>
          <Text style={styles.titleSmall}>Ručni unos</Text>
          <TouchableOpacity onPress={() => setManualModalVisible(true)} style={styles.iconButton}>
            <Image
              source={require('@/assets/images/info-icon.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Unesi barkod"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={13}
          value={manualInput}
          onChangeText={setManualInput}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleManualSubmit} style={styles.submitButton}>
          <Text style={styles.submitText}>Potvrdi</Text>
        </TouchableOpacity>
        <Text style={styles.note}>Barkod mora sadržavati 13 znamenki</Text>
      </View>

      {/* Info Modal */}
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
    backgroundColor: '#FFFFFF',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  titleSmall: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  scannerContainer: {
    height: 250,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
  },
  manualEntryContainer: {
    marginTop: 20,
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
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#555',
    marginTop: 6,
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 16,
    color: '#000',
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
