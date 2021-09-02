import React from "react";
import moment from "moment";
import { View, StyleSheet, FlatList, Alert } from "react-native";

import Icon from "../components/Icon";
import Text from "../components/Text";
import colors from "../config/colors";
import { formatVND } from "../utility/formatCurrency";
import { deleteOrder } from "../api/order";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";

function UserDetailsScreen({ navigation, route }) {
  const { user, getUsers } = route.params;

  const colorStatus = {
    Pending: "blue",
    Shipping: "orange",
    Done: "green",
    Cancel: "red",
  };

  const handleDelete = (id) => {
    Alert.alert("WARNING", "Bạn thật sự muốn xoá đơn hàng này?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await deleteOrder(id);
          getUsers();
          navigation.goBack();
        },
      },
    ]);
  };

  const totalMoney = () => {
    let res = 0;
    user.order.forEach((order) => {
      if (order.status === "Done") res += order.totalPrice;
    });
    return formatVND(res);
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Thông tin chi tiết</Text>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Tên</Text>
          <Text style={styles.infoValue}>{user.name}</Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>SĐT</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Số đơn</Text>
          <Text style={styles.infoValue}>{user.order.length}</Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Tổng thu</Text>
          <Text style={[styles.infoValue, { color: colors.primary }]}>
            {totalMoney()}
          </Text>
        </View>
      </View>

      <View style={styles.orderContainer}>
        <Text style={styles.title}>Danh sách đơn hàng</Text>
      </View>
      <FlatList
        data={user.order}
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
            onPress={() =>
              navigation.navigate("OrderDetails", {
                item,
                isAdmin: true,
                getOrders: () => {
                  getUsers();
                  navigation.goBack();
                  navigation.goBack();
                },
              })
            }
            renderRightActions={
              item.status === "Cancel" || item.status === "Done"
                ? () => (
                    <ListItemDeleteAction
                      onPress={() => handleDelete(item.id)}
                    />
                  )
                : null
            }
          />
        )}
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
  infoContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  infoLabel: {
    flex: 1,
    color: colors.medium,
  },
  infoValue: {
    flex: 2,
    fontWeight: "500",
  },
  orderContainer: {
    backgroundColor: colors.white,
    padding: 10,
  },
});

export default UserDetailsScreen;
