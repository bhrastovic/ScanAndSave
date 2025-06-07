import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal } from 'react-native';


import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [animationEnabled, setAnimationEnabled] = React.useState(true);
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);


const handleReset = () => {
setResetModalVisible(true);
};

  const handleLogout = () => {
  setLogoutModalVisible(true);
};


  return (
    <SafeAreaView style={styles.container}>

      <Modal
        transparent
        visible={resetModalVisible}
        animationType="fade"
        onRequestClose={() => setResetModalVisible(false)}
      >
    <View style={styles.modalOverlay}> <View style={styles.modalContainer}> 
    <Text style={styles.modalTitle}>Resetiranje</Text> 
    <Text style={styles.modalMessage}> Jeste li sigurni da želite resetirati postavke? </Text> 
    <View style={styles.modalButtons}> 
    <TouchableOpacity style={styles.cancelButton} onPress={() => setResetModalVisible(false)} > 
      <Text style={styles.cancelButtonText}>Odustani</Text> 
    </TouchableOpacity> 
    <TouchableOpacity style={styles.confirmButton} onPress={() => { setResetModalVisible(false); console.log('Postavke resetirane'); }} > 
      <Text style={styles.confirmButtonText}>Resetiraj</Text> 
    </TouchableOpacity> 
    </View> 
    </View> 
    </View> 
    </Modal>

      <Modal
      transparent
      visible={logoutModalVisible}
      animationType="fade"
      onRequestClose={() => setLogoutModalVisible(false)}
  
      >
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Odjava</Text>
          <Text style={styles.modalMessage}>Želite li se odjaviti?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setLogoutModalVisible(false)}
              >
              <Text style={styles.cancelButtonText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
              setLogoutModalVisible(false);
              console.log('Odjavljen');
              }}
              >
              <Text style={styles.confirmButtonText}>Odjavi se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}> <TouchableOpacity onPress={() => router.push('/profile')} style={styles.backButton}>
             <Image source={require('@/assets/images/iconBack.png')} style={styles.backIcon} /> </TouchableOpacity>
         <Text style={styles.title}>Postavke</Text> </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFIL</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Obavijesti aplikacije</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor="#fff"
              trackColor={{ false: '#ccc', true: '#f90' }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lokacija</Text>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              thumbColor="#fff"
              trackColor={{ false: '#ccc', true: '#f90' }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Početna animacija</Text>
            <Switch
              value={animationEnabled}
              onValueChange={setAnimationEnabled}
              thumbColor="#fff"
              trackColor={{ false: '#ccc', true: '#f90' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OSTALO</Text>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.label}>Politika privatnosti</Text>
            <Image
              source={require('@/assets/images/iconArrowRight.png')}
              style={styles.arrow}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.label}>Uvjeti korištenja</Text>
            <Image
              source={require('@/assets/images/iconArrowRight.png')}
              style={styles.arrow}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Image
              source={require('@/assets/images/iconReset.png')}
              style={styles.buttonIcon}
            />
            <Text style={styles.resetText}>Resetiraj</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Image
              source={require('@/assets/images/iconLogout.png')}
              style={styles.buttonIcon}
            />
            <Text style={styles.logoutText}>Odjavi se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 60,
  },
  backButton: {
    marginBottom: 12,
    paddingRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 24,
    color: '#000',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    width: 18,
    height: 18,
  },
  buttons: {
    gap: 16,
    marginTop: 20,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#f55',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resetText: {
    color: '#f55',
    fontWeight: '600',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#f55',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#f55',
    fontWeight: '600',
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  width: '80%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 24,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 12,
  color: '#000',
},
modalMessage: {
  fontSize: 15,
  color: '#444',
  marginBottom: 20,
},
modalButtons: {
  flexDirection: 'row',
  gap: 12,
},
cancelButton: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#fff',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#ccc',
},
cancelButtonText: {
  color: '#000',
},
confirmButton: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#f90',
  borderRadius: 20,
},
confirmButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},

});
