import React, { useState } from "react";
import Swiper from "react-native-swiper";
import { connect } from "react-redux";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import colors from "../config/colors";
import Screen from "../components/Screen";
import Icon from "../components/Icon";
import { formatVND } from "../utility/formatCurrency";
import * as cartAction from "../redux/actions/cartItem";

function ListingDetailsScreen({ route, addToCart, products }) {
  const id = route.params;
  const listing = products.filter((i) => i.id === id)[0];

  const handleAddProduct = async (product) => {
    await addToCart(product);
  };

  const status =
    listing.countInStock > 0
      ? { title: "Còn hàng", color: colors.secondary }
      : { title: "Hết hàng", color: colors.danger };

  return (
    <Screen style={{ paddingTop: 0 }}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleAddProduct(listing)}
      >
        <Icon
          style={{ borderRadius: 0, width: "90%", height: 45 }}
          name="cart-plus"
          backgroundColor={colors.primary}
          size={30}
          text="Thêm vào giỏ hàng"
        />
      </TouchableOpacity>

      <ScrollView style={{ marginBottom: 50 }}>
        <Swiper
          style={{ backgroundColor: colors.black }}
          showsPagination={false}
          showsButtons
          height={300}
          loop={false}
        >
          {listing.images.map((image) => (
            <Image
              key={image.toString()}
              resizeMode="contain"
              style={styles.image}
              source={{ uri: image }}
            />
          ))}
        </Swiper>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{listing.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatVND(listing.price)}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>Chi tiết</Text>
          <View style={styles.detailOdd}>
            <Text style={styles.left}>Thương hiệu</Text>
            <Text style={styles.right}>{listing.brand}</Text>
          </View>
          <View style={styles.detailEven}>
            <Text style={styles.left}>Loại</Text>
            <Text style={styles.right}>{listing.category.name}</Text>
          </View>
          <View style={styles.detailOdd}>
            <Text style={styles.left}>Nồng độ</Text>
            <Text style={styles.right}>{listing.concentration}</Text>
          </View>
          <View style={styles.detailEven}>
            <Text style={styles.left}>Thể tích</Text>
            <Text style={styles.right}>{listing.volume}</Text>
          </View>
          <View style={styles.detailOdd}>
            <Text style={styles.left}>Xuất xứ</Text>
            <Text style={styles.right}>{listing.origin}</Text>
          </View>
          <View style={styles.detailEven}>
            <Text style={styles.left}>Trạng thái</Text>
            <Text style={[styles.right, { color: status.color }]}>
              {status.title}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>Mô tả</Text>
          <Text style={{ paddingHorizontal: 10, lineHeight: 25 }}>
            {listing.description}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  titleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    marginBottom: 10,
  },
  price: {
    fontSize: 25,
    flex: 1,
    color: colors.black,
  },
  detailsContainer: {
    padding: 10,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailOdd: {
    backgroundColor: colors.light,
    flexDirection: "row",
    padding: 10,
  },
  detailEven: {
    padding: 10,
    flexDirection: "row",
  },
  left: {
    flex: 1,
    color: colors.medium,
  },
  right: {
    flex: 2,
  },
  button: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    width: "100%",
    padding: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: async (item) => dispatch(cartAction.addToCart(item)),
});

export default connect(
  (state) => ({ products: state.products }),
  mapDispatchToProps
)(ListingDetailsScreen);
