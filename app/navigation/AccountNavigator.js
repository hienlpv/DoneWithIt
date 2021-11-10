import React from "react";

import AccountScreen from "../screens/AccountScreen";
import ListingEditScreen from "../screens/ListingEditScreen";
import OrderListScreen from "../screens/OrderListScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import ProductListScreen from "../screens/ProductListScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import UserListScreen from "../screens/UserListScreen";
import UserEditScreen from "../screens/UserEditScreen";
import UserDetailsScreen from "../screens/UserDetailsScreen";
import useNotifications from "../hooks/useNotifications";
import { navigate } from "./rootNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import StatisticScreen from "../screens/StatisticScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => {
  // useNotifications(() => navigate("Account"));
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
      <Stack.Screen
        name="UserEdit"
        component={UserEditScreen}
        options={{
          title: "Thông tin cá nhân",
        }}
      />
      <Stack.Screen
        name="Users"
        component={UserListScreen}
        options={{
          title: "Danh sách khách hàng",
        }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailsScreen}
        options={{
          title: "Thông tin khách hàng",
        }}
      />
      <Stack.Screen
        name="Statistic"
        component={StatisticScreen}
        options={{
          title: "Thống kê",
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
