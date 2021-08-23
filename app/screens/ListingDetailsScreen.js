import React from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import Swiper from "react-native-swiper";

// import Text from "../components/Text";
import colors from "../config/colors";
import Screen from "../components/Screen";
import Button from "../components/Button";
import Icon from "../components/Icon";
import * as cartAction from "../redux/actions/cartItem";
import { formatVND } from "../utility/formatCurrency";

function ListingDetailsScreen({ route, addToCart }) {
  const listing = route.params;

  const status =
    listing.countInStock > 0
      ? { title: "In Stock", color: colors.secondary }
      : { title: "Out of Stock", color: colors.danger };

  return (
    <Screen>
      <ScrollView>
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
            <TouchableOpacity onPress={() => addToCart(listing)}>
              <Icon
                name="cart-plus"
                backgroundColor={colors.primary}
                size={50}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>Details</Text>
          <View style={styles.detailOdd}>
            <Text style={styles.left}>Brand</Text>
            <Text style={styles.right}>{listing.brand}</Text>
          </View>
          <View style={styles.detailEven}>
            <Text style={styles.left}>Category</Text>
            <Text style={styles.right}>{listing.category.name}</Text>
          </View>
          <View style={styles.detailOdd}>
            <Text style={styles.left}>Status</Text>
            <Text style={[styles.right, { color: status.color }]}>
              {status.title}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>Description</Text>
          <Text style={{ padding: 10 }}>{listing.description}</Text>
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
    fontSize: 30,
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
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (item) => dispatch(cartAction.addToCart(item)),
});

export default connect(null, mapDispatchToProps)(ListingDetailsScreen);
