import React, { useContext } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Text from "../components/Text";
import colors from "../config/colors";
import AuthContext from "../auth/context";
import FeedNavigator from "./FeedNavigator";
import CartNavigator from "./CartNavigator";
import AuthNavigator from "./AuthNavigator";
import AccountNavigator from "./AccountNavigator";

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
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={30} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate("Feed");
          },
        })}
      />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <MaterialCommunityIcons name="cart" color={color} size={30} />
              <CartIcon length={props.cartItems.length} />
            </View>
          ),
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
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={30} />
          ),
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
