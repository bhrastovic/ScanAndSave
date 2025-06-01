import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const allProducts = [
  { id: '1', name: 'Kinder jaje' },
  { id: '2', name: 'Kinder joy' },
  { id: '3', name: 'Kinder čokolada' },
  { id: '4', name: 'Kinder bueno bijeli' },
  { id: '5', name: 'Kinder bueno crni' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Jaja', 'Kinder bueno', 'Livanjski sir', 'Pršut']);
  const [results, setResults] = useState<typeof allProducts>([]);
  const [searched, setSearched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setResults([]);
      setSearched(false);
      return;
    }

    const filtered = allProducts.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered); // ✅ cijeli objekt, ne samo string
    setSearched(true);
  };

  const handleRecentSearch = (text: string) => {
    setQuery(text);
    handleSearch(text);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const handleDeleteRecent = (item: string) => {
    setRecentSearches(recentSearches.filter((term) => term !== item));
  };

  const handleSubmit = () => {
    if (query.trim() === '') return;
    if (!recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches].slice(0, 10));
    }
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Pretraži proizvod</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
          <Image
            source={require('@/assets/images/info-icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
      <View style={styles.inputWrapper}>
          <Image source={require('@/assets/images/iconSearchBlack.png')} style={styles.searchIconBlack} />
          <TextInput
            placeholder="Upiši naziv ili barkod proizvoda"
            placeholderTextColor="#999999"
            value={query}
            onChangeText={handleSearch}
            onSubmitEditing={handleSubmit}
            style={styles.input}
          />
        </View>


      {query.length === 0 && !searched ? (
        <>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Nedavno pretraživani</Text>
            <TouchableOpacity onPress={handleClearRecent}>
              <Image
                source={require('@/assets/images/icontrash.png')}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
          {recentSearches.map((item) => (
            <View key={item} style={styles.recentItem}>
              <TouchableOpacity onPress={() => handleRecentSearch(item)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image
                  source={require('@/assets/images/iconSearchGrey.png')}
                  style={styles.searchIconGrey}
                />
                <Text style={styles.recentText}>{item}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteRecent(item)}>
                <Ionicons name="close-outline" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : searched && results.length === 0 ? (
        <View style={styles.noResults}>
          <Image
            source={require('@/assets/images/NoResults.png')}
            style={styles.noResultsImage}
            resizeMode="contain"
          />
          <Text style={styles.noResultsText}>Nema rezultata</Text>
          <Text style={styles.noResultsHint}>
            Nismo pronašli nijedan proizvod za traženi pojam. Provjerite jeste li ispravno upisali naziv ili pokušajte s drugim pojmom.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Link href="/product" asChild>
              <TouchableOpacity style={styles.resultItem}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            </Link>
          )}

        />
      )} 
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ovdje možete pretraživati proizvode upisivanjem naziva ili skeniranjem barkoda.
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
  flex: 1,
  backgroundColor: '#fff',
},
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingTop: 30,
  paddingHorizontal: 20,
  backgroundColor: '#fff',
},
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  inputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#000',
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  marginBottom: 20,
},
searchIconBlack: {
  width: 20,
  height: 20,
  marginRight: 10,
},
input: {
  flex: 1,
  fontSize: 16,
  color: '#000',
  padding: 0,
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    flex: 1,
    color: '#000000',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recentText: {
    fontSize: 15,
    color: '#444',
  },
  noResults: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 10,
  },
  noResultsImage: {
  width: 180,
  height: 180,
  marginBottom: 20,
},

  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsHint: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  searchIconGrey: {
  width: 16,
  height: 16,
  marginRight: 8,
  tintColor: '#888', // ako želiš sivkasti efekt
},
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconButton: {
  padding: 8,
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
  textAlign: 'center',
},
icon: {
  width: 24,
  height: 24,
},
});
