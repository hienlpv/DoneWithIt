import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { ListItem, ListItemSeparator } from "../components/lists";

import Screen from "../components/Screen";
import AppText from "../components/Text";
import colors from "../config/colors";

function OrderDetailsScreen({ route }) {
  const order = route.params.item;

  return (
    <Screen>
      <View style={{ marginBottom: 20 }}>
        <View style={styles.container}>
          <AppText style={styles.header}>Status</AppText>
          <AppText style={styles.content}>{order.status}</AppText>
        </View>
        <View style={styles.container}>
          <AppText style={styles.header}>City</AppText>
          <AppText style={styles.content}>{order.city}</AppText>
        </View>
        <View style={styles.container}>
          <AppText style={styles.header}>Address</AppText>
          <AppText style={styles.content}>{order.shippingAddress1}</AppText>
        </View>
        <View style={styles.container}>
          <AppText style={styles.header}>Phone</AppText>
          <AppText style={styles.content}>{order.phone}</AppText>
        </View>
        <View style={styles.container}>
          <AppText style={styles.header}>Total</AppText>
          <AppText style={styles.content}>{order.totalPrice}</AppText>
        </View>
        <View style={styles.container}>
          <AppText style={styles.header}>Date Created</AppText>
          <AppText style={styles.content}>
            {order.dateOrdered.slice(0, 10)}
          </AppText>
        </View>
      </View>
      <FlatList
        data={order.orderItems}
        keyExtractor={(oderItem) => oderItem._id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.product.name}
            subTitle={`$${item.product.price} x ${item.quantity}`}
            image={item.product.images[0]}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: colors.white,
    borderBottomWidth: 0.5,
  },
  header: {
    fontWeight: "bold",
    width: "40%",
  },
  content: {
    flex: 1,
  },
});

export default OrderDetailsScreen;