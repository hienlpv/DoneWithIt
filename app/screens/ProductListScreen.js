import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, FlatList, Alert } from "react-native";

import colors from "../config/colors";
import Text from "../components/Text";
import { formatVND } from "../utility/formatCurrency";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import * as productAction from "../redux/actions/product";

function ProductListScreen(props) {
  const { products, deleteProduct, fetchProducts, navigation } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    await fetchProducts();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    Alert.alert("WARNING", "Bạn thật sự muốn xoá sản phẩm này?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          setLoading(true);
          await deleteProduct(id);
          setLoading(false);
        },
      },
    ]);
  };

  if (products.length === 0) {
    return (
      <Screen>
        <Text style={{ textAlign: "center" }}>Không có sản phẩm nào</Text>
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(product) => product.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subTitle={`${formatVND(item.price)} x ${item.countInStock}`}
            image={item.images[0]}
            onPress={() => navigation.navigate("EditProduct", { item })}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item.id)} />
            )}
          />
        )}
        refreshing={loading}
        onRefresh={() => getProducts()}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.light,
  },
});

const mapStateToProps = (state) => ({ products: state.products });
const mapDispatchToProps = (dispatch) => ({
  deleteProduct: (id) => dispatch(productAction.deleteProducts(id)),
  fetchProducts: async () => dispatch(productAction.deleteProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductListScreen);
