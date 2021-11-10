import React, { useContext } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AuthContext from "../auth/context";
import FeedNavigator from "./FeedNavigator";
import CartNavigator from "./CartNavigator";
import AuthNavigator from "./AuthNavigator";
import AccountNavigator from "./AccountNavigator";
import CartIcon from "../components/CartIcon";

const Tab = createBottomTabNavigator();

const AppNavigator = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        keyboardHidesTabBar: true,
      }}
      lazy={false}
    >
      <Tab.Screen
        name="Feed"
        component={FeedNavigator}
        options={({ navigation }) => {
          const route =
            navigation.getState().routes[navigation.getState().index];
          const routeName = route.state
            ? route.state.routeNames[route.state.index]
            : "";
          return {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={30} />
            ),
            tabBarVisible: routeName !== "ListingDetails",
          };
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            // navigation.navigate("Feed");
          },
        })}
      />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={({ navigation }) => {
          const route =
            navigation.getState().routes[navigation.getState().index];
          const routeName = route.state
            ? route.state.routeNames[route.state.index]
            : "Cart";
          return {
            tabBarIcon: ({ color }) => (
              <View>
                <MaterialCommunityIcons name="cart" color={color} size={30} />
                <CartIcon length={props.cartItems.length} top={-5} right={-5} />
              </View>
            ),
            tabBarVisible: routeName === "Cart",
          };
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate("Cart");
          },
        })}
      />

      <Tab.Screen
        name="Account"
        component={user ? AccountNavigator : AuthNavigator}
        options={({ navigation }) => {
          const route =
            navigation.getState().routes[navigation.getState().index];
          const routeName = route.state
            ? route.state.routeNames[route.state.index]
            : "Account";
          return {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={30} />
            ),
            tabBarVisible: routeName === "Account",
          };
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate("Account");
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default connect((state) => ({ cartItems: state.cartItems }))(
  AppNavigator
);
