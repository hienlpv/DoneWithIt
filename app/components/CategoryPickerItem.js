import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import Text from "./Text";
import Icon from "./Icon";

function CategoryPickerItem({ onPress, item }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon backgroundColor={item.color} name={item.icon} size={80} />
      <Text style={styles.label}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    width: "33%",
  },
  label: {
    marginTop: 5,
    textAlign: "center",
  },
});

export default CategoryPickerItem;
