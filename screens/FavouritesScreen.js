import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { getFavorites, removeFavorite } from "../services/firebaseConfig";

const FavouritesScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavourites = useCallback(async () => {
    try {
      setLoading(true);
      const records = await getFavorites();
      setFavourites(records);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not load favourites.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavourites();
    }, [loadFavourites])
  );

  const removeFavouriteEntry = async (docId, name) => {
    await removeFavorite(docId);
    await loadFavourites();
    Alert.alert("Favourite Removed", `${name} was removed.`, [{ text: "OK" }]);
  };

  const clearAllFavourites = async () => {
    await Promise.all(favourites.map((item) => removeFavorite(item.docId)));
    await loadFavourites();
    Alert.alert("All Favourites Cleared", "All items removed.", [
      { text: "OK" },
    ]);
  };

  const confirmFavouriteRemoval = (docId, name) => {
    Alert.alert("Confirm Removal", `Remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", onPress: () => removeFavouriteEntry(docId, name) },
    ]);
  };

  const confirmClearAllFavourites = () => {
    if (favourites.length === 0) return;
    Alert.alert("Confirm Clear All", "Do you want to clear all favourites?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", onPress: clearAllFavourites },
    ]);
  };

  const renderFavouriteItem = ({ item }) => (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [
          styles.cardTextWrapper,
          pressed && styles.pressed,
        ]}
        android_ripple={{ color: "#ccc" }}
        onPress={() => navigation.navigate("Details", { id: item.id })}
      >
        <Text style={styles.cardText}>
          {item.name} ({item.symbol})
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.removeButton,
          pressed && styles.pressed,
        ]}
        android_ripple={{ color: "#880000" }}
        onPress={() => confirmFavouriteRemoval(item.docId, item.name)}
      >
        <Text style={styles.removeText}>Remove</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {favourites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No currency found.</Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.docId}
          renderItem={renderFavouriteItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Pressable
        style={({ pressed }) => [
          styles.clearFavouritesButton,
          favourites.length === 0 && styles.disabledButton,
          pressed && styles.pressed,
        ]}
        android_ripple={{ color: "#cc4444" }}
        onPress={confirmClearAllFavourites}
        disabled={favourites.length === 0}
      >
        <Text
          style={[
            styles.buttonText,
            favourites.length === 0 && styles.disabledText,
          ]}
        >
          Clear Favourites
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#828282",
    margin: 20,
  },
  listContent: { paddingVertical: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 6,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTextWrapper: { flex: 1, marginRight: 16 },
  cardText: { fontSize: 20, fontWeight: "700" },
  removeButton: { padding: 8 },
  removeText: { color: "red", fontWeight: "500" },
  clearFavouritesButton: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    width: "90%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "red",
  },
  disabledButton: { backgroundColor: "#ccc" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  disabledText: { color: "#999" },
  pressed: { opacity: 0.8 },
});

export default FavouritesScreen;
