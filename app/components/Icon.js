import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import Text from "./Text";

function Icon({
  name,
  size = 40,
  backgroundColor = `${colors.medium}`,
  iconColor = "#fff",
  number,
  style,
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      {number ? <Text style={{ color: "#fff" }}>{number}</Text> : null}
      {name && (
        <MaterialCommunityIcons
          name={name}
          color={iconColor}
          size={size * 0.5}
        />
      )}
    </View>
  );
}

export default Icon;
