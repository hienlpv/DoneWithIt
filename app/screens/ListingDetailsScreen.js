import React from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";

import AppText from "../components/Text";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";
import Screen from "../components/Screen";
import AppButton from "../components/Button";
import * as cartAction from "../redux/actions/cartItem";

function ListingDetailsScreen({ route, addToCart }) {
  const listing = route.params;

  return (
    <Screen>
      <ScrollView>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={{ uri: listing.images[0] }}
        />
        <View style={styles.detailsContainer}>
          <AppText style={styles.title}>{listing.name}</AppText>
          <AppText style={styles.price}>${listing.price}</AppText>
          <AppText style={styles.description}>{listing.description}</AppText>
          <AppButton title="ADD TO CART" onPress={() => addToCart(listing)} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
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
