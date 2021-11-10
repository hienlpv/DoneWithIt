import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";

import Screen from "../components/Screen";
import AppText from "../components/Text";
import Picker from "../components/Picker";
import colors from "../config/colors";
import { formatVND } from "../utility/formatCurrency";
import { getUserOrder, updateOrder } from "../api/order";
import { ListItem, ListItemSeparator } from "../components/lists";

function OrderDetailsScreen({ route }) {
  const order = route.params.item;
  const isAdmin = route.params.isAdmin;
  const fetchOrders = route.params.fetchOrders;

  const [status, setStatus] = useState(order.status);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const Status = [
    {
      id: 1,
      label: "Pending",
      display: "Đã tiếp nhận",
      color: colors.secondary,
    },
    {
      id: 2,
      label: "Shipping",
      display: "Đang giao hàng",
      color: "orange",
    },
    {
      id: 3,
      label: "Done",
      display: "Giao hàng thành công",
      color: "green",
    },
    {
      id: 4,
      label: "Cancel",
      display: "Huỷ bỏ",
      color: "red",
    },
  ];

  const getOrderDetail = async () => {
    if (!isAdmin) return setOrderItems(order.orderItems);

    setLoading(true);
    const res = await getUserOrder(order._id);
    setLoading(false);

    if (!res.ok) return;

    setOrderItems(res.data.orderItems);
  };

  useEffect(() => {
    getOrderDetail();
  }, []);

  const colorStatus = (label) => {
    let find = false;
    Status.forEach((i, index) => {
      if (i.label === label) find = index;
    });
    return find ? Status[find].color : colors.secondary;
  };

  const handleUpdate = async (label) => {
    setStatus(label);

    setUpdating(true);
    const res = await updateOrder(order.id, { status: label });
    setUpdating(false);

    if (!res.ok) {
      setStatus(order.status);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Fail",
        text2: "Cập nhật trạng thái thất bại! Vui lòng thử lại!",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        onPress: () => Toast.hide(),
      });
      console.log(res.status);
      return;
    }
    Toast.show({
      type: "success",
      position: "top",
      text1: "Successfully",
      text2: "Cập nhật thành công",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
    fetchOrders();
  };

  return (
    <Screen style={{ paddingTop: 0 }}>
      <View style={{ marginBottom: 20, backgroundColor: colors.white }}>
        {isAdmin && (
          <View style={styles.container}>
            <AppText style={styles.header}>Chủ đơn</AppText>
            <AppText style={styles.content}>{order.user.name}</AppText>
          </View>
        )}

        <View style={styles.container}>
          <AppText style={styles.header}>Trạng thái</AppText>
          {isAdmin && order.status !== "Cancel" ? (
            <View style={styles.content}>
              <Picker
                width="70%"
                title="Cập nhật trạng thái đơn hàng"
                placeholder={status}
                items={Status}
                style={{ padding: 0, marginVertical: 0 }}
                onSelectItem={(item) => handleUpdate(item.label)}
              />
              <ActivityIndicator animating={updating} color={colors.primary} />
            </View>
          ) : (
            <AppText
              style={[styles.content, { color: colorStatus(order.status) }]}
            >
              {Status.find((i) => i.label === order.status).display}
            </AppText>
          )}
        </View>
        {order.status === "Cancel" && (
          <View style={styles.container}>
            <AppText style={styles.header}>Lý do huỷ đơn</AppText>
            <AppText style={[styles.content, { fontSize: 16 }]}>
              {order.reasonCancel}
            </AppText>
          </View>
        )}
        <View style={styles.container}>
          <AppText style={styles.header}>Địa chỉ</AppText>
          <AppText style={[styles.content, { fontSize: 16 }]}>
            {order.shippingAddress1}
          </AppText>
        </View>
        <View style={styles.container}>
          <AppText style={styles.header}>Số ĐT</AppText>
          <AppText style={styles.content}>{order.phone}</AppText>
        </View>
        <View style={styles.container}>
          <AppText style={styles.header}>Tổng</AppText>
          <AppText style={[styles.content, { color: colors.primary }]}>
            {formatVND(order.totalPrice)}
          </AppText>
        </View>
        <View style={styles.container}>
          <AppText style={styles.header}>Ngày tạo</AppText>
          <AppText style={styles.content}>
            {order.dateOrdered.slice(0, 10)}
          </AppText>
        </View>
      </View>
      <FlatList
        data={orderItems}
        keyExtractor={(oderItem) => oderItem._id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.product.name}
            subTitle={`${formatVND(item.product.price)} x ${item.quantity}`}
            image={item.product.images[0]}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={loading}
        onRefresh={() => {}}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomColor: colors.light,
    borderBottomWidth: 1,
  },
  header: {
    color: colors.medium,
    width: "40%",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
});

export default OrderDetailsScreen;
