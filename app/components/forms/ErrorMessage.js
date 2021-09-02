import React from "react";
import { StyleSheet } from "react-native";

import Text from "../Text";

function ErrorMessage({ error, visible, style }) {
  if (!visible || !error) return null;

  return <Text style={[styles.error, style]}>{error}</Text>;
}

const styles = StyleSheet.create({
  error: { color: "red", width: "100%", fontSize: 14 },
});

export default ErrorMessage;
