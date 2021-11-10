import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";

import colors from "../config/colors";
import Text from "../components/Text";
import { formatVND } from "../utility/formatCurrency";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import * as productAction from "../redux/actions/product";
import Icon from "../components/Icon";
import Screen from "../components/Screen";

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
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddProduct", {})}
        >
          <Icon
            style={{ borderRadius: 0, width: "90%", height: 45 }}
            name="plus"
            backgroundColor={colors.primary}
            size={30}
            text="Thêm sản phẩm"
          />
        </TouchableOpacity>
        <Text style={{ textAlign: "center" }}>Không có sản phẩm nào</Text>
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddProduct", {})}
      >
        <Icon
          style={{ borderRadius: 0, width: "90%", height: 45 }}
          name="plus"
          backgroundColor={colors.primary}
          size={30}
          text="Thêm sản phẩm"
        />
      </TouchableOpacity>
      <FlatList
        style={{ marginBottom: 50 }}
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
  button: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    padding: 10,
    zIndex: 1,
    width: "100%",
    backgroundColor: colors.white,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
});

const mapStateToProps = (state) => ({ products: state.products });
const mapDispatchToProps = (dispatch) => ({
  deleteProduct: (id) => dispatch(productAction.deleteProducts(id)),
  fetchProducts: async () => dispatch(productAction.fetchProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductListScreen);
