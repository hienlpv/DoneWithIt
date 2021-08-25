import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";

import Screen from "../components/Screen";
import Card from "../components/Card";
import Text from "../components/Text";
import colors from "../config/colors";
import * as productAction from "../redux/actions/product";
import { getCategories } from "../api/category";
import { formatVND } from "../utility/formatCurrency";
import AppTextInput from "../components/TextInput";
import { ListItem, ListItemSeparator } from "../components/lists";
import Icon from "../components/Icon";
import { color } from "react-native-reanimated";

function ListingsScreen(props) {
  const { navigation, products, fetchProducts } = props;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [countInStock, setCountInStock] = useState(products.countInStock);

  const getProducts = async () => {
    setLoading(true);
    await fetchProducts(setFilteredProducts);
    const result = await getCategories();
    setLoading(false);

    if (!result.ok) return setCategories([]);
    setCategories(result.data);
  };

  const handleActive = (id) => {
    setActive(id);
    if (id === 0) setFilteredProducts(products.reverse());
    else
      setFilteredProducts(
        products.reverse().filter((product) => product.category._id === id)
      );
  };

  const search = (text) => {
    setFilteredProducts(
      products.reverse().filter((product) => product.name.includes(text))
    );
  };

  const closeSearch = () => {
    setSearchActive(false);
    setFilteredProducts(products);
    setActive(0);
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (searchActive)
    return (
      <Screen style={styles.screen}>
        <View style={styles.searchContainer}>
          <AppTextInput
            icon="card-search"
            onChangeText={(text) => search(text)}
            onFocus={() => setSearchActive(true)}
            autoFocus
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => closeSearch()}
          >
            <Icon name="close" size={30} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredProducts}
          keyExtractor={(product) => product.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              subTitle={formatVND(item.price)}
              image={item.images[0]}
              onPress={() => navigation.navigate("ListingDetails", item)}
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
        />
      </Screen>
    );
  return (
    <Screen style={styles.screen}>
      <View style={styles.searchContainer}>
        <AppTextInput
          icon="card-search"
          onChangeText={(text) => search(text)}
          onFocus={() => setSearchActive(true)}
        />
      </View>
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Text
            onPress={() => handleActive(0)}
            style={[
              styles.categories,
              { color: active === 0 ? colors.primary : colors.medium },
            ]}
          >
            All
          </Text>
          {categories.map((category) => (
            <Text
              onPress={() => handleActive(category.id)}
              key={category.id}
              style={[
                styles.categories,
                {
                  color:
                    active === category.id ? colors.primary : colors.medium,
                },
              ]}
            >
              {category.name}
            </Text>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={active === 0 ? products.reverse() : filteredProducts}
        keyExtractor={(data) => data.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.name}
            subTitle={
              item.countInStock === 0
                ? "Tạm thời hết hàng"
                : formatVND(item.price)
            }
            imageURL={item.images[0]}
            onPress={() => navigation.navigate("ListingDetails", item.id)}
            color={item.countInStock === 0 ? colors.danger : colors.secondary}
          />
        )}
        refreshing={loading}
        onRefresh={() => {
          setActive(0);
          getProducts();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 5,
    backgroundColor: colors.light,
    justifyContent: "center",
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
  },
  categories: {
    color: colors.medium,
    backgroundColor: colors.light,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 25,
  },
});

const mapStateToProps = (state) => ({ products: state.products });
const mapDispatchToProps = (dispatch) => ({
  fetchProducts: async (setFilteredProducts) =>
    dispatch(productAction.fetchProducts(setFilteredProducts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingsScreen);
