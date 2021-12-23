import React, { useEffect, useState } from "react";
import colorRandom from "random-color";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";

import Icon from "../components/Icon";
import TextInput from "../components/TextInput";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { fetchUser } from "../api/auth";
import { fetchOrders } from "../api/order";
import { ListItem, ListItemSeparator } from "../components/lists";
import string_to_slug from "../utility/slugify";

function UserListScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersFiltered, setUsersFiltered] = useState(users);

  const getUsers = async () => {
    setLoading(true);
    let resOrder = await fetchOrders();
    let resUser = await fetchUser();
    setLoading(false);

    if (resOrder.ok) setOrders(resOrder.data);
    if (resUser.ok) {
      setUsers(
        resUser.data
          .map((user) => ({
            ...user,
            order: resOrder.data.filter((order) => order.user.id === user.id),
          }))
          .filter((user) => !user.isAdmin)
      );
      setUsersFiltered(
        resUser.data
          .map((user) => ({
            ...user,
            order: resOrder.data.filter((order) => order.user.id === user.id),
          }))
          .filter((user) => !user.isAdmin)
      );
    }
  };

  const search = (text) => {
    setUsersFiltered(
      users.filter((user) =>
        string_to_slug(user.email).includes(text.toLowerCase())
      )
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
      <View style={styles.searchContainer}>
        <TextInput icon="card-search" onChangeText={(text) => search(text)} />
      </View>
      <FlatList
        data={usersFiltered.sort((a, b) => b.order - a.order)}
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
  closeButton: {
    position: "absolute",
    right: 10,
    top: 25,
  },
});

export default UserListScreen;
