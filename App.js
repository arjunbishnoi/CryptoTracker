// App.js
import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import FavouritesScreen from "./screens/FavouritesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#ccc",
          },
          headerTintColor: "black",
          headerBackTitle: "Back",
          headerLargeTitle: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Cryptocurrencies" }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ title: "Coin Details" }}
        />
        <Stack.Screen
          name="Favourites"
          component={FavouritesScreen}
          options={{ title: "Favourites" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
