import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";

const Stack = createStackNavigator();

const FeedNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Listings"
        component={ListingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListingDetails"
        component={ListingDetailsScreen}
        options={{ title: "Listing Details" }}
      />
    </Stack.Navigator>
  );
};

export default FeedNavigator;
