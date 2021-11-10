import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
} from "react-native";

import Text from "./Text";
import Button from "./Button";
import Screen from "./Screen";
import defaultStyles from "../config/styles";
import PickerItem from "./PickerItem";
import colors from "../config/colors";

function AppPicker({
  width = "100%",
  title,
  icon,
  items,
  onSelectItem,
  placeholder,
  selectedItem,
  PickerItemComponent = PickerItem,
  numberOfColumn = 1,
  style,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={[styles.container, { width }, style]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
          )}
          {selectedItem ? (
            <Text style={styles.text}>{selectedItem.name}</Text>
          ) : (
            <Text
              style={[
                styles.placeholder,
                {
                  color: items.find((i) => i.label === placeholder)
                    ? items.find((i) => i.label === placeholder).color
                    : colors.medium,
                },
              ]}
            >
              {items.find((i) => i.label === placeholder)
                ? items.find((i) => i.label === placeholder).display
                : placeholder}
            </Text>
          )}

          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={defaultStyles.colors.medium}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <Screen>
          <Button
            style={styles.button}
            title="X"
            onPress={() => setModalVisible(false)}
          />
          <Text style={styles.title}>{title}</Text>
          <FlatList
            style={{ marginTop: 10 }}
            data={items}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numberOfColumn}
            renderItem={({ item }) => (
              <PickerItemComponent
                item={item}
                onPress={() => {
                  setModalVisible(false);
                  onSelectItem(item);
                }}
              />
            )}
          />
        </Screen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  text: {
    flex: 1,
  },
  button: {
    width: 45,
    height: 45,
    position: "absolute",
    right: 10,
    top: -20,
    backgroundColor: colors.medium,
  },
  title: {
    fontSize: 25,
    marginTop: 50,
    textAlign: "center",
    color: colors.secondary,
    fontWeight: "bold",
  },
});

export default AppPicker;
