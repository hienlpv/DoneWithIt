import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import moment from "moment";

import { getUserOrders } from "../api/order";
import Icon from "../components/Icon";
import { ListItem, ListItemSeparator } from "../components/lists";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";

function OrderListScreen(props) {
  const { navigation, route } = props;
  const { isAdmin, id } = route.params.user;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const colorStatus = {
    Pending: "blue",
    Shipping: "orange",
    Done: "green",
  };

  const getOrders = async () => {
    if (!isAdmin) {
      setLoading(true);
      const result = await getUserOrders(id);
      setLoading(false);

      if (!result.ok) return console.log(result.data);
      setOrders(result.data);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Screen>
      {loading && (
        <ActivityIndicator
          style={{ height: "100%" }}
          animating={loading}
          size="large"
          color={colors.primary}
        />
      )}
      {orders.length === 0 && !loading && (
        <Text style={{ textAlign: "center" }}>Your Order List is Empty</Text>
      )}
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id.toString()}
        renderItem={({ item, index }) => (
          <ListItem
            titleColor={colorStatus[item.status]}
            title={item.status}
            subTitle={moment(item.dateOrdered).fromNow()}
            IconComponent={
              <Icon
                number={(index + 1).toString()}
                backgroundColor={colors.primary}
              />
            }
            onPress={() => navigation.navigate("OrderDetails", { item })}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default OrderListScreen;
