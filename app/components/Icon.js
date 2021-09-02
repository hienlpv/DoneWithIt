import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Text from "./Text";
import colors from "../config/colors";

function Icon({
  name,
  size = 40,
  backgroundColor = `${colors.medium}`,
  iconColor = "#fff",
  number,
  style,
  text,
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          flexDirection: "row",
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
      {text && (
        <Text style={{ color: colors.white, marginLeft: 5 }}>{text}</Text>
      )}
    </View>
  );
}

export default Icon;
