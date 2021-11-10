import React, { useEffect, useState } from "react";
import randomColor from "random-color";
import { StyleSheet, FlatList, View, TouchableOpacity } from "react-native";

import Icon from "../components/Icon";
import Text from "../components/Text";
import Screen from "../components/Screen";
import colors from "../config/colors";
import TextInput from "../components/TextInput";
import { getCategories, addCategory, deleteCategory } from "../api/category";
import {
  ListItem,
  ListItemSeparator,
  ListItemDeleteAction,
} from "../components/lists";

function CategoriesScreen(props) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const getCategory = async () => {
    setLoading(true);
    const res = await getCategories();
    setLoading(false);

    if (!res.ok) return console.log(res.data);
    setCategories(res.data);
  };

  const handleAdd = async () => {
    const color = randomColor();
    const dataPost = {
      name: category,
      icon: "bottle-wine",
      color: color.hexString(),
    };
    await addCategory(dataPost);
    setCategory("");
    getCategory();
  };

  useEffect(() => {
    getCategory();
  }, []);

  if (categories.length === 0 && !loading) {
    return (
      <Screen>
        <Text style={{ textAlign: "center" }}>Không có loại sản phẩm nào</Text>
        <View style={styles.addContainer}>
          <TextInput
            style={{ backgroundColor: colors.light }}
            width="60%"
            icon="bottle-wine"
            placeholder="Loại mới"
            value={category}
            onChangeText={(text) => setCategory(text)}
          />
          <TouchableOpacity onPress={handleAdd}>
            <Icon
              name="plus"
              style={{ borderRadius: 5, width: 100, height: 50 }}
              backgroundColor={colors.primary}
              size={30}
              text="Thêm"
            />
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <FlatList
        style={{ marginBottom: 70 }}
        data={categories}
        keyExtractor={(category) => category.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            IconComponent={
              <Icon name={item.icon} backgroundColor={item.color} />
            }
            renderRightActions={() => (
              <ListItemDeleteAction
                onPress={async () => {
                  await deleteCategory(item.id);
                  getCategory();
                }}
              />
            )}
          />
        )}
        refreshing={loading}
        onRefresh={() => getCategory()}
        ItemSeparatorComponent={ListItemSeparator}
      />
      <View style={styles.addContainer}>
        <TextInput
          style={{ backgroundColor: colors.light }}
          width="60%"
          icon="bottle-wine"
          placeholder="Loại mới"
          value={category}
          onChangeText={(text) => setCategory(text)}
        />
        <TouchableOpacity onPress={handleAdd}>
          <Icon
            name="plus"
            style={{ borderRadius: 5, width: 100, height: 50 }}
            backgroundColor={colors.primary}
            size={30}
            text="Thêm"
          />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0,
  },
  addContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    zIndex: 1,
  },
});

export default CategoriesScreen;
