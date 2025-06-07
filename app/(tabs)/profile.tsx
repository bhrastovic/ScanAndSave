import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EditIcon from '@/assets/images/editIcon.svg';
import InfoIcon from '@/assets/images/info-icon.svg';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('Ivo Ivić');
  const [email, setEmail] = useState('ivoivic@gmail.com');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const router = useRouter();

  const openImageOptions = () => {
    const options = profileImage
      ? [
          { text: 'Promijeni sliku', onPress: pickFromGallery },
          { text: 'Ukloni sliku', onPress: () => setProfileImage(null), style: 'destructive' as 'destructive' },
          { text: 'Odustani', style: 'cancel' as 'cancel' },
        ]
      : [
          { text: 'Učitaj iz galerije', onPress: pickFromGallery },
          { text: 'Kamera', onPress: takePhoto },
          { text: 'Odustani', style: 'cancel' as 'cancel' },
        ];

    Alert.alert(
      'Profilna slika',
      profileImage
        ? 'Želiš li promijeniti ili ukloniti trenutnu sliku?'
        : 'Dodaj svoju profilnu sliku.',
      options
    );
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleEditPress = () => {
    Alert.alert('Uredi profil', 'Što želiš napraviti?', [
      {
        text: 'Uredi',
        onPress: () => {
          setTempName(name);
          setTempEmail(email);
          setEditMode(true);
          setEditModalVisible(true);
        },
      },
      { text: 'Odustani', style: 'cancel' as 'cancel' },
    ]);
  };

  const saveChanges = () => {
    setName(tempName);
    setEmail(tempEmail);
    setEditMode(false);
    setEditModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
          <InfoIcon width={35} height={35} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="person" size={32} color="#888" />
              </View>
            )}
            <TouchableOpacity style={styles.cameraButton} onPress={openImageOptions}>
              <Image
                source={require('@/assets/images/iconCamera.png')}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <TouchableOpacity onPress={handleEditPress}>
            <EditIcon width={32} height={32} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.option} onPress={() => router.push('/omiljeni')}>
          <Image source={require('@/assets/images/iconHeart.png')} style={styles.optionIcon} />
          <Text style={styles.optionText}>Omiljeni proizvodi</Text>
          <Image source={require('@/assets/images/iconArrowRight.png')} style={styles.arrow} />
        </TouchableOpacity>

        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.option}>
            <Image source={require('@/assets/images/iconSettings.png')} style={styles.optionIcon} />
            <Text style={styles.optionText}>Postavke</Text>
            <Image source={require('@/assets/images/iconArrowRight.png')} style={styles.arrow} />
          </TouchableOpacity>
        </Link>

        <View style={styles.option}>
          <Image
            source={require('@/assets/images/iconCreditCard.png')}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Pretplate</Text>
          <Image
            source={require('@/assets/images/iconArrowRight.png')}
            style={styles.arrow}
          />
        </View>
      </ScrollView>

      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Uredi profil</Text>
            <TextInput
              placeholder="Ime i prezime"
              value={tempName}
              onChangeText={setTempName}
              style={styles.input}
            />
            <TextInput
              placeholder="E-mail"
              value={tempEmail}
              onChangeText={setTempEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalButton}>
                <Text>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveChanges} style={styles.modalButton}>
                <Text>Spremi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={infoModalVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setInfoModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ovdje se nalazi tvoj korisnički profil.{"\n\n"}
              Možeš urediti svoje podatke, postaviti sliku i pristupiti omiljenim proizvodima te postavkama.
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
    width: '100%',
    height: '100%',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  cameraIcon: {
    width: 28,
    height: 28,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionIcon: {
    width: 28,
    height: 28,
    marginRight: 20,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    width: 20,
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 10,
    width: '80%',
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});