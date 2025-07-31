import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { fetchCryptoList } from "../services/api";

const HomeScreen = ({ navigation }) => {
  const [cryptoList, setCryptoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Cryptocurrencies",
      headerLargeTitle: false,
    });
  }, [navigation]);

  useEffect(() => {
    const loadCryptoList = async () => {
      try {
        const list = await fetchCryptoList(0, 50);
        setCryptoList(list);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Could not load cryptocurrencies.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCryptoList();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const renderCryptoItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.cryptoCard, pressed && styles.pressed]}
      android_ripple={{ color: "#ccc" }}
      onPress={() => navigation.navigate("Details", { id: item.id })}
    >
      <Text style={styles.cryptoText}>
        {item.name} ({item.symbol})
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cryptoList}
        keyExtractor={(item) => item.id}
        renderItem={renderCryptoItem}
        contentContainerStyle={styles.listContainer}
      />

      <Pressable
        style={({ pressed }) => [
          styles.favouritesButton,
          pressed && styles.pressed,
        ]}
        android_ripple={{ color: "#444" }}
        onPress={() => navigation.navigate("Favourites")}
      >
        <Text style={styles.buttonText}>All Favourites</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { paddingVertical: 16, paddingBottom: 100 },
  cryptoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 6,
    padding: 16,
    alignSelf: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cryptoText: { fontSize: 16, fontWeight: "500" },
  favouritesButton: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    width: "90%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "black",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  pressed: { opacity: 0.8 },
});

export default HomeScreen;
