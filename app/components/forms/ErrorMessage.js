import React from "react";
import { StyleSheet } from "react-native";

import AppText from "../Text";

function ErrorMessage({ error, visible, style }) {
  if (!visible || !error) return null;

  return <AppText style={[styles.error, style]}>{error}</AppText>;
}

const styles = StyleSheet.create({
  error: { color: "red", width: "100%", fontSize: 14 },
});

export default ErrorMessage;
