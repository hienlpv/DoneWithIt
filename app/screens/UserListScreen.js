import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import colorRandom from "random-color";

import { fetchUser } from "../api/auth";
import { fetchOrders } from "../api/order";
import { ListItem, ListItemSeparator } from "../components/lists";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import colors from "../config/colors";

function UserListScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    setLoading(true);
    let resOrder = await fetchOrders();
    let resUser = await fetchUser();
    setLoading(false);

    if (resOrder.ok) setOrders(resOrder.data);
    if (resUser.ok)
      setUsers(
        resUser.data
          .map((user) => ({
            ...user,
            order: resOrder.data.filter((order) => order.user.id === user.id),
          }))
          .filter((user) => !user.isAdmin)
      );
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (users.length === 0 && !loading) {
    return (
      <Screen>
        <Text style={{ textAlign: "center" }}>Không có người dùng nào!</Text>
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users.sort((a, b) => b.order - a.order)}
        keyExtractor={(user) => user.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.email}
            subTitle={item.order.length + " đơn hàng"}
            IconComponent={
              <Icon
                name="account"
                backgroundColor={colorRandom().hexString()}
              />
            }
            onPress={() =>
              navigation.navigate("UserDetail", { user: item, getUsers })
            }
          />
        )}
        refreshing={loading}
        onRefresh={() => getUsers()}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
});

export default UserListScreen;
