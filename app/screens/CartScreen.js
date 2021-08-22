import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { connect } from "react-redux";

import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import Button from "../components/Button";
import * as cartAction from "../redux/actions/cartItem";
import Text from "../components/Text";

function CartScreen(props) {
  const { cartItems, navigation } = props;

  if (cartItems.length === 0)
    return (
      <Screen>
        <Text style={{ textAlign: "center" }}>Your Cart is Empty</Text>
      </Screen>
    );

  const Total = () => {
    let res = 0;

    cartItems.forEach((cartItem) => {
      res += cartItem.price * cartItem.count;
    });

    return res;
  };

  return (
    <Screen>
      <FlatList
        data={cartItems}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subTitle={`$${item.price} x ${item.count}`}
            image={item.images[0]}
            onPress={() => console.log("Message selected", item)}
            renderRightActions={() => (
              <ListItemDeleteAction
                onPress={() => props.removeFromCart(item)}
              />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
      />
      <View style={styles.checkoutContainer}>
        <View>
          <Text>Count: {cartItems.length}</Text>
          <Text>Total: {Total()}</Text>
        </View>
        <Button
          style={styles.checkoutButton}
          title="Checkout"
          onPress={() => navigation.navigate("Checkout")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  checkoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  checkoutButton: {
    width: "60%",
  },
});

const mapStateToProps = (state) => ({ cartItems: state.cartItems });
const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch(cartAction.clearCart()),
  removeFromCart: (item) => dispatch(cartAction.removeFromCart(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);
