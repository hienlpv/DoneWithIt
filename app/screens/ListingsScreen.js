import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { connect } from "react-redux";

import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import useApi from "../hooks/useApi";
import { getProducts } from "../api/product";
import * as productAction from "../redux/actions/product";
function ListingsScreen(props) {
  const { navigation, products, fetchProducts } = props;
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    await fetchProducts();
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Screen style={styles.screen}>
      <ActivityIndicator
        animating={loading}
        size="large"
        color={colors.primary}
      />
      <FlatList
        data={products}
        keyExtractor={(data) => data.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.name}
            subTitle={"$" + item.price}
            imageURL={item.images[0]}
            onPress={() => navigation.navigate("ListingDetails", item)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    backgroundColor: colors.light,
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({ products: state.products });
const mapDispatchToProps = (dispatch) => ({
  fetchProducts: async () => dispatch(productAction.fetchProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingsScreen);
