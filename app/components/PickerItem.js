import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import colors from "../config/colors";

import Text from "./Text";

function PickerItem({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={[styles.text, { color: item.color }]}>{item.display}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 20,
  },
  text: {
    padding: 20,
    fontSize: 20,
  },
});

export default PickerItem;
