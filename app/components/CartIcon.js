import React from "react";
import { View } from "react-native";
import Text from "../components/Text";
import colors from "../config/colors";

const CartIcon = ({
  length,
  backgroundColor = colors.primary,
  top,
  left,
  right,
  bottom,
}) => {
  if (length === 0) return null;
  return (
    <View
      style={{
        backgroundColor,
        top,
        left,
        right,
        bottom,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 1,
      }}
    >
      <Text style={{ fontSize: 10, color: colors.white }}>{length}</Text>
    </View>
  );
};

export default CartIcon;
