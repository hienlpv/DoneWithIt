import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ListingEditScreen from "../screens/ListingEditScreen";
import OrderListScreen from "../screens/OrderListScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import ProductListScreen from "../screens/ProductListScreen";
import CategoriesScreen from "../screens/CategoriesScreen";

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
          title: "Thêm sản phẩm",
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={ListingEditScreen}
        options={{
          title: "Sửa sản phẩm",
        }}
      />
      <Stack.Screen
        name="Orders"
        component={OrderListScreen}
        options={{
          title: "Danh sách đơn hàng",
        }}
      />
      <Stack.Screen
        name="Products"
        component={ProductListScreen}
        options={{
          title: "Danh sách sản phẩm",
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{
          title: "Chi tiết đơn hàng",
        }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "Danh sách loại",
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
