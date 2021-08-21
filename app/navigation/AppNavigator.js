import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { connect } from "react-redux";

import ListingEditScreen from "../screens/ListingEditScreen";
import FeedNavigator from "./FeedNavigator";
import AccountNavigator from "./AccountNavigator";
import CartNavigator from "./CartNavigator";
import colors from "../config/colors";
import Text from "../components/Text";

const Tab = createBottomTabNavigator();

const CartIcon = ({ length }) => {
  if (length === 0) return null;
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: -5,
        top: -5,
      }}
    >
      <Text style={{ fontSize: 10, color: colors.white }}>{length}</Text>
    </View>
  );
};

const AppNavigator = (props) => {
  return (
    <Tab.Navigator tabBarOptions={{ showLabel: false }}>
      <Tab.Screen
        name="Feed"
        component={FeedNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialCommunityIcons name="cart" color={color} size={size} />
              <CartIcon length={props.cartItems.length} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ListingEdit"
        component={ListingEditScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default connect((state) => ({ cartItems: state.cartItems }))(
  AppNavigator
);
