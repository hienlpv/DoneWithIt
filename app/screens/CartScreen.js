import React, { useContext } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import Icon from "../components/Icon";
import * as cartAction from "../redux/actions/cartItem";
import Text from "../components/Text";
import AuthContext from "../auth/context";
import colors from "../config/colors";
import { formatVND } from "../utility/formatCurrency";

function CartScreen(props) {
  const { cartItems, navigation } = props;
  const { user } = useContext(AuthContext);

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
            subTitle={`${formatVND(item.price)} x ${item.count}`}
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
              name="credit-card-check"
              style={{ borderRadius: 5, width: 120, height: 50 }}
              backgroundColor={colors.primary}
              size={30}
              text="Checkout"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Icon
              name="account"
              style={{ borderRadius: 5, width: 120, height: 50 }}
              backgroundColor={colors.primary}
              size={40}
              text="Login"
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
});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);
