import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { fetchCryptoDetails } from '../services/api';
import { addFavorite, removeFavorite, getFavorites } from '../services/firebaseConfig';

const DetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [favDocId, setFavDocId] = useState(null);

  const loadDetails = useCallback(async () => {
    try {
      const result = await fetchCryptoDetails(id);
      setCrypto(result);
    } catch {
      Alert.alert('Error', 'Could not load crypto details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkFavourite = useCallback(async () => {
    if (!crypto) return;
    const list = await getFavorites();
    const fav = list.find(item => item.id === crypto.id);
    setIsFavourite(!!fav);
    setFavDocId(fav?.docId || null);
  }, [crypto]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  useEffect(() => {
    checkFavourite();
  }, [checkFavourite]);

  useFocusEffect(
    useCallback(() => {
      checkFavourite();
    }, [checkFavourite])
  );

  const toggleFavourite = async () => {
    if (!crypto) return;

    if (isFavourite && favDocId) {
      await removeFavorite(favDocId);
      Alert.alert('Removed from Favourites', `${crypto.name} removed.`, [{ text: 'OK' }]);
    } else {
      await addFavorite({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price_usd: crypto.price_usd,
      });
      Alert.alert('Added to Favourites', `${crypto.name} added.`, [{ text: 'OK' }]);
    }

    await checkFavourite();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{crypto.name}</Text>
        <Text style={styles.subtitle}>{crypto.symbol}</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Price (USD)</Text>
          <Text style={styles.cardValue}>${parseFloat(crypto.price_usd).toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Market Cap</Text>
          <Text style={styles.cardValue}>${parseFloat(crypto.market_cap_usd).toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>24h Volume</Text>
          <Text style={styles.cardValue}>${parseFloat(crypto.volume24).toFixed(2)}</Text>
        </View>
      </ScrollView>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.primaryButton,
          pressed && styles.pressed,
        ]}
        android_ripple={{ color: '#444' }}
        onPress={() => navigation.navigate('Favourites')}
      >
        <Text style={styles.buttonText}>All Favourites</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          isFavourite ? styles.removeButton : styles.secondaryButton,
          styles.actionButton,
          pressed && styles.pressed,
        ]}
        android_ripple={{ color: isFavourite ? '#880000' : '#0088ff' }}
        onPress={toggleFavourite}
      >
        <Text style={styles.buttonText}>
          {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  scrollContent: { padding: 16, paddingBottom: 140 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 38, fontWeight: 'bold', textAlign: 'center', marginTop: 16 },
  subtitle: { fontSize: 22, color: '#666', textAlign: 'center', marginBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLabel: { fontSize: 14, color: '#888888', marginBottom: 4 },
  cardValue: { fontSize: 24, fontWeight: '600' },
  button: {
    position: 'absolute',
    width: '90%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },
  primaryButton: { backgroundColor: 'black', bottom: 16 },
  secondaryButton: { backgroundColor: '#00a92aff' },
  removeButton: { backgroundColor: 'red' },
  actionButton: { bottom: 80 },
  pressed: { opacity: 0.8 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default DetailsScreen;
