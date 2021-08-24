import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ListingEditScreen from "../screens/ListingEditScreen";
import OrderListScreen from "../screens/OrderListScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import ProductListScreen from "../screens/ProductListScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddProduct"
        component={ListingEditScreen}
        options={{
          title: "Add Product",
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={ListingEditScreen}
        options={{
          title: "Edit Product",
        }}
      />
      <Stack.Screen
        name="Orders"
        component={OrderListScreen}
        options={{
          title: "Order List",
        }}
      />
      <Stack.Screen
        name="Products"
        component={ProductListScreen}
        options={{
          title: "Product List",
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{
          title: "Order Details",
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
