import React, { useContext } from "react";
import { connect } from "react-redux";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";

// components
import Screen from "../components/Screen";
import Icon from "../components/Icon";
import Text from "../components/Text";

import colors from "../config/colors";
import AuthContext from "../auth/context";
import { formatVND } from "../utility/formatCurrency";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import * as cartAction from "../redux/actions/cartItem";

function CartScreen(props) {
  const { cartItems, navigation, addToCart, decreaseFromCart } = props;
  const { user } = useContext(AuthContext);

  const CountComponent = ({ price, count, item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text>{formatVND(price)}</Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity onPress={() => decreaseFromCart(item)}>
          <Icon
            size={20}
            name="arrow-left"
            backgroundColor={colors.secondary}
          />
        </TouchableOpacity>
        <Text>{count}</Text>
        <TouchableOpacity onPress={() => addToCart(item)}>
          <Icon
            size={20}
            name="arrow-right"
            backgroundColor={colors.secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cartItems.length === 0)
    return (
      <Screen>
        <Text style={{ textAlign: "center" }}>Giỏ hàng hiện đang rỗng</Text>
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
    <Screen style={{ paddingTop: 0 }}>
      <FlatList
        style={{ marginBottom: 10 }}
        data={cartItems}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            // subTitle={`${formatVND(item.price)} x ${item.count}`}
            subComponent={
              <CountComponent
                price={item.price}
                count={item.count}
                item={item}
              />
            }
            image={item.images[0]}
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
        <View style={styles.checkoutDetail}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.left}>Số lượng:</Text>
            <Text style={styles.right}>{cartItems.length}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.left}>Tổng tiền:</Text>
            <Text style={styles.right}>{formatVND(Total())}</Text>
          </View>
        </View>
        {user ? (
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Icon
              style={{ borderRadius: 5, width: 130, height: 50 }}
              backgroundColor={colors.primary}
              size={40}
              text="Thanh Toán"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Icon
              style={{ borderRadius: 5, width: 130, height: 50 }}
              backgroundColor={colors.primary}
              size={40}
              text="Đăng nhập"
            />
          </TouchableOpacity>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  checkoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: colors.white,
  },
  checkoutButton: {
    flex: 1,
    alignItems: "center",
  },
  checkoutDetail: {
    flex: 2,
  },
  left: {
    flex: 1,
    fontSize: 14,
    color: colors.medium,
  },
  right: {
    flex: 2,
    color: colors.secondary,
  },
});

const mapStateToProps = (state) => ({ cartItems: state.cartItems });
const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch(cartAction.clearCart()),
  removeFromCart: (item) => dispatch(cartAction.removeFromCart(item)),
  addToCart: (item) => dispatch(cartAction.addToCart(item)),
  decreaseFromCart: (item) => dispatch(cartAction.decreaseFromCart(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);
