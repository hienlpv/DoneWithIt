import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ListingEditScreen from "../screens/ListingEditScreen";
import OrderListScreen from "../screens/OrderListScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen
        name="ListingEdit"
        component={ListingEditScreen}
        options={{
          title: "Add Product",
        }}
      />
      <Stack.Screen
        name="Orders"
        component={OrderListScreen}
        options={{
          title: "Orders List",
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
