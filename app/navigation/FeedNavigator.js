import React from "react";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";

import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import Icon from "../components/Icon";
import colors from "../config/colors";
import CartIcon from "../components/CartIcon";

const Stack = createStackNavigator();

const FeedNavigator = ({ cartItems }) => {
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
        options={({ navigation }) => {
          return {
            title: "Chi tiết sản phẩm",
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
                <Icon
                  name="cart"
                  size={50}
                  backgroundColor="#fff"
                  iconColor={colors.medium}
                />
                <CartIcon length={cartItems.length} top={5} left={3} />
              </TouchableOpacity>
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default connect((state) => ({ cartItems: state.cartItems }))(
  FeedNavigator
);
