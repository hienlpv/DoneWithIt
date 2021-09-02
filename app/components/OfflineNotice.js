import React from "react";
import Constants from "expo-constants";
import { useNetInfo } from "@react-native-community/netinfo";
import { View, StyleSheet } from "react-native";

import Text from "./Text";
import colors from "../config/colors";

function OfflineNotice(props) {
  const netInfo = useNetInfo();

  if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    );
  return null;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    top: Constants.statusBarHeight,
    alignItems: "center",
    backgroundColor: colors.primary,
    zIndex: 99,
  },
  text: {
    color: colors.white,
  },
});

export default OfflineNotice;
