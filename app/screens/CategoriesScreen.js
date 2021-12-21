import React, { useEffect, useState } from "react";
import randomColor from "random-color";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import Icon from "../components/Icon";
import Text from "../components/Text";
import Screen from "../components/Screen";
import TextInput from "../components/TextInput";
import colors from "../config/colors";
import {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../api/category";
import {
  ListItem,
  ListItemSeparator,
  ListItemDeleteAction,
} from "../components/lists";

function CategoriesScreen(props) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [choose, setChoose] = useState();

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
    const res = await addCategory(dataPost);

    if (!res.ok) return;

    setCategory("");
    getCategory();
  };

  const handleDelete = async (id) => {
    const res = await deleteCategory(id);
    if (!res.ok)
      return Alert.alert("ERROR", "Không thể xoá loại sản phẩm này!");
    getCategory();
  };

  const handleUpdate = (item) => {
    setIsUpdate(true);
    setChoose(item);
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
            onPress={() => handleUpdate(item)}
            renderRightActions={() => (
              <ListItemDeleteAction
                onPress={async () => {
                  await handleDelete(item.id);
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
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isUpdate}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <TouchableWithoutFeedback onPress={() => setIsUpdate(false)}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.updateContainer}>
                  <TextInput
                    style={{ backgroundColor: colors.light, marginRight: 10 }}
                    width="60%"
                    icon="bottle-wine"
                    placeholder="Loại"
                    value={choose ? choose.name : ""}
                    onChangeText={(text) =>
                      setChoose({ ...choose, name: text })
                    }
                  />
                  <TouchableOpacity
                    onPress={async () => {
                      await updateCategory(choose.id, { name: choose.name });
                      setIsUpdate(false);
                      getCategory();
                    }}
                  >
                    <Icon
                      style={{ borderRadius: 5, width: 100, height: 50 }}
                      backgroundColor={colors.primary}
                      size={30}
                      text="Sửa"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  updateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default CategoriesScreen;
