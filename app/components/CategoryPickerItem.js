import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./Text";
import Icon from "./Icon";

function CategoryPickerItem({ onPress, item }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon backgroundColor={item.color} name={item.icon} size={80} />
      <AppText style={styles.label}>{item.name}</AppText>
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
