import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import products from '../../data/products_proba.json';

// SVG komponente
import IconDelete from '@/assets/images/iconDelete.svg';
import IconSearchGrey from '@/assets/images/iconSearchGrey.svg';
import InfoIcon from '@/assets/images/info-icon.svg';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<typeof products>([]);
  const [searched, setSearched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoRecentModalVisible, setInfoRecentModalVisible] = useState(false);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setResults([]);
      setSearched(false);
      return;
    }
    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      item.barcode.includes(text)
    );
    setResults(filtered);
    setSearched(true);
  };

  const handleRecentSearch = (text: string) => {
    setQuery(text);
    handleSearch(text);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Gornji header */}
            <View style={styles.header}>
              <Text style={styles.title}>Pretraži proizvod</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <InfoIcon width={35} height={35} />
              </TouchableOpacity>
            </View>

            <View style={styles.container}>
              {/* Input za pretragu */}
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Upiši naziv ili barkod proizvoda"
                  placeholderTextColor="#999999"
                  value={query}
                  onChangeText={handleSearch}
                  onSubmitEditing={handleSubmit}
                  style={styles.input}
                />
              </View>

              {/* Nedavno pretraživani */}
              {query.length === 0 && !searched ? (
                <>
                  <View style={styles.recentHeader}>
                    <Text style={styles.recentTitle}>Nedavno pretraživani</Text>
                    <TouchableOpacity onPress={() => setInfoRecentModalVisible(true)}>
                      <InfoIcon width={35} height={35} />
                    </TouchableOpacity>
                  </View>
                  {recentSearches.map((item) => (
                    <View key={item} style={styles.recentItem}>
                      <TouchableOpacity
                        onPress={() => handleRecentSearch(item)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}
                      >
                        <IconSearchGrey width={16} height={16} style={{ marginRight: 8 }} />
                        <Text style={styles.recentText}>{item}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteRecent(item)}
                        style={{ padding: 4, justifyContent: 'center' }}
                      >
                        <IconDelete width={20} height={20} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              ) : searched && results.length === 0 ? (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>Nema rezultata</Text>
                  <Text style={styles.noResultsHint}>
                    Nismo pronašli nijedan proizvod za traženi pojam. Provjerite jeste li ispravno
                    upisali naziv ili pokušajte s drugim pojmom.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.barcode}
                  renderItem={({ item }) => (
                    <Link href={{ pathname: '/product', params: { barcode: item.barcode } }} asChild>
                      <TouchableOpacity style={styles.resultItem}>
                        <View>
                          <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                          <Text style={{ color: '#666' }}>Barkod: {item.barcode}</Text>
                        </View>
                      </TouchableOpacity>
                    </Link>
                  )}
                />
              )}
            </View>

            {/* Modal: Gornji info */}
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
                    Ovdje možete pretraživati proizvode upisivanjem naziva ili barkoda.{"\n\n"}
                    Na ekranu će vam se prikazati nedavno pretraživani pojmovi, a možete ih i obrisati.
                  </Text>
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Modal: Info za "Nedavno pretraživani" */}
            <Modal
              transparent={true}
              visible={infoRecentModalVisible}
              animationType="fade"
              onRequestClose={() => setInfoRecentModalVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => setInfoRecentModalVisible(false)}
              >
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Ova funkcionalnost dolazi uskoro.</Text>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
  },
  container: {
    paddingTop: 30,
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
    marginBottom: 30,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
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
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
});
