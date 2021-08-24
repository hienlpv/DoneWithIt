import React, { useState } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, FlatList } from "react-native";

import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import Text from "../components/Text";
import { formatVND } from "../utility/formatCurrency";
import * as productAction from "../redux/actions/product";

function ProductListScreen(props) {
  const { products, deleteProduct, navigation } = props;
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteProduct(id);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {products.length === 0 && (
        <Text style={{ textAlign: "center" }}>Your Product List is Empty</Text>
      )}
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
        onRefresh={() => {}}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({ products: state.products });
const mapDispatchToProps = (dispatch) => ({
  deleteProduct: (id) => dispatch(productAction.deleteProducts(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductListScreen);
