import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  FlatList,
  ScrollView,
  View,
  Alert,
  TouchableHighlight,
  Modal,
  CheckBox,
  TextInput,
} from "react-native";

import Icon from "../components/Icon";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
import { deleteOrder } from "../api/order";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import { momentVN } from "../utility/momentVN";
import * as productActions from "../redux/actions/product";
import * as orderActions from "../redux/actions/order";

function OrderListScreen(props) {
  const { navigation, route, fetchProducts, orders, getOrders, updateStatus } =
    props;
  const { isAdmin } = route.params.user;

  const [ordersFiltered, setOrdersFiltered] = useState(orders);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelected1, setSelection1] = useState(false);
  const [isSelected2, setSelection2] = useState(false);
  const [isSelected3, setSelection3] = useState(true);
  const [reasonCancel, setReasonCancel] = useState("");
  const [idOrderCancel, setIdOrderCancel] = useState();

  const colorStatus = {
    Pending: "blue",
    Shipping: "orange",
    Done: "green",
    Cancel: "red",
  };

  const filterStatus = [
    {
      name: "All",
      display: "Tất cả",
    },
    {
      name: "Pending",
      display: "Đã tiếp nhận",
    },
    {
      name: "Shipping",
      display: "Đang giao hàng",
    },
    {
      name: "Done",
      display: "Giao hàng thành công",
    },
    {
      name: "Cancel",
      display: "Huỷ bỏ",
    },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    await getOrders(route.params.user, setOrdersFiltered);
    setLoading(false);
  };

  const handleActive = (index) => {
    setActive(index);
    if (index === 0) return setOrdersFiltered(orders);
    setOrdersFiltered(
      orders.filter((i) => i.status === filterStatus[index].name)
    );
  };

  const handleDelete = (item) => {
    const { id } = item;
    if (isAdmin)
      Alert.alert("WARNING", "Bạn thật sự muốn xoá đơn hàng này?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            const res = await deleteOrder(id);
            console.log(res);
            await fetchOrders();
          },
        },
      ]);
    else
      Alert.alert("WARNING", "Bạn thực sự muốn huỷ đơn hàng này?", [
        { text: "cancel", style: "cancel" },
        {
          text: "ok",
          onPress: () => {
            setModalVisible(true);
            setIdOrderCancel(id);
          },
        },
      ]);
  };

  const handleCancel = async () => {
    setModalVisible(!modalVisible);

    await updateStatus(idOrderCancel, {
      status: "Cancel",
      reasonCancel: reasonCancel,
    });

    fetchProducts();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (orders.length === 0 && !loading) {
    return (
      <Screen>
        <Text style={{ textAlign: "center" }}>Không có đơn hàng nào</Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {filterStatus.map((i, index) => (
            <Text
              key={index}
              onPress={() => handleActive(index)}
              style={[
                styles.filter,
                { color: active === index ? colors.primary : colors.medium },
              ]}
            >
              {i.display}
            </Text>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={ordersFiltered}
        keyExtractor={(order) => order.id.toString()}
        renderItem={({ item, index }) => (
          <ListItem
            titleColor={colorStatus[item.status]}
            title={filterStatus.find((i) => i.name === item.status).display}
            subTitle={momentVN(item.dateOrdered)}
            IconComponent={
              <Icon
                number={(index + 1).toString()}
                backgroundColor={colors.primary}
              />
            }
            onPress={() =>
              navigation.navigate("OrderDetails", {
                item,
                isAdmin,
                fetchOrders,
              })
            }
            renderRightActions={
              isAdmin
                ? item.status === "Cancel" || item.status === "Done"
                  ? () => (
                      <ListItemDeleteAction
                        onPress={() => handleDelete(item)}
                      />
                    )
                  : null
                : item.status === "Pending" || item.status === "Shipping"
                ? () => (
                    <ListItemDeleteAction onPress={() => handleDelete(item)} />
                  )
                : null
            }
          />
        )}
        refreshing={loading}
        onRefresh={() => getOrders(route.params.user)}
        ItemSeparatorComponent={ListItemSeparator}
      />
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Vì sao bạn muốn huỷ đơn hàng ?
              </Text>
              <View style={{ marginVertical: 10 }}>
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    value={isSelected1}
                    onValueChange={(value) => {
                      setSelection1(value);
                      setReasonCancel("Muốn thay đổi địa chỉ giao hàng");
                      if (!value) return;
                      setSelection2(!value);
                      setSelection3(!value);
                    }}
                    style={styles.checkbox}
                  />
                  <Text>Muốn thay đổi địa chỉ giao hàng</Text>
                </View>
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    value={isSelected2}
                    onValueChange={(value) => {
                      setSelection2(value);
                      setReasonCancel("Đổi ý không mua nữa");
                      if (!value) return;
                      setSelection1(!value);
                      setSelection3(!value);
                    }}
                    style={styles.checkbox}
                  />
                  <Text>Đổi ý không mua nữa</Text>
                </View>
                <View
                  style={[
                    styles.checkboxContainer,
                    { alignItems: "flex-start", marginTop: 5 },
                  ]}
                >
                  <CheckBox
                    value={isSelected3}
                    onValueChange={(value) => {
                      setSelection3(value);
                      if (!value) return;
                      setSelection1(!value);
                      setSelection2(!value);
                    }}
                    style={styles.checkbox}
                  />
                  <TextInput
                    onChangeText={setReasonCancel}
                    style={styles.TextInput}
                    placeholder="Khác"
                    multiline
                    editable={isSelected3}
                  />
                </View>
              </View>
              <View style={styles.btnContainer}>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.danger,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: "#00b200",
                  }}
                  onPress={handleCancel}
                >
                  <Text style={styles.textStyle}>Accept</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0,
  },
  filterContainer: {
    backgroundColor: colors.white,
    marginVertical: 10,
    padding: 10,
  },
  filter: {
    color: colors.medium,
    backgroundColor: colors.light,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginLeft: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 30,
    color: colors.secondary,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 5,
  },
  TextInput: {
    backgroundColor: colors.light,
    flex: 1,
    height: 100,
    borderRadius: 10,
    textAlignVertical: "top",
    padding: 5,
    fontSize: 18,
  },
  btnContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
});

export default connect(
  (state) => ({ orders: state.orders }),
  (dispatch) => ({
    fetchProducts: async () => dispatch(productActions.fetchProducts()),
    getOrders: async (user, setOrdersFiltered) =>
      dispatch(orderActions.getOrders(user, setOrdersFiltered)),
    updateStatus: async (id, data) =>
      dispatch(orderActions.updateStatus(id, data)),
  })
)(OrderListScreen);
