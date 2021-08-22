import React from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import Swiper from "react-native-swiper";

import AppText from "../components/Text";
import colors from "../config/colors";
import Screen from "../components/Screen";
import AppButton from "../components/Button";
import * as cartAction from "../redux/actions/cartItem";

function ListingDetailsScreen({ route, addToCart }) {
  const listing = route.params;

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

        <View style={styles.detailsContainer}>
          <AppText style={styles.title}>{listing.name}</AppText>
          <AppText style={styles.content}>Brand: {listing.brand}</AppText>
          <AppText style={styles.content}>
            Category: {listing.category.name}
          </AppText>

          <AppText style={{ textAlign: "center" }}>Description</AppText>
          <AppText style={styles.content}>{listing.description}</AppText>

          <View style={styles.priceContainer}>
            <AppText style={styles.price}>${listing.price}</AppText>
            <AppButton
              style={{ flex: 1 }}
              title="ADD TO CART"
              onPress={() => addToCart(listing)}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    padding: 10,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  userContainer: {
    marginVertical: 40,
  },
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (item) => dispatch(cartAction.addToCart(item)),
});

export default connect(null, mapDispatchToProps)(ListingDetailsScreen);
