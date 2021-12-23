import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { connect } from "react-redux";
import colorRandom from "random-color";
import moment from "moment";

// config
import colors from "../config/colors";

// components
import Icon from "../components/Icon";
// import Button from "../components/Button";
import { ListItem, ListItemSeparator } from "../components/lists";

// api
import { fetchUser } from "../api/auth";
import { getUserOrder } from "../api/order";

// utility
import { momentVN } from "../utility/momentVN";
import { formatVND } from "../utility/formatCurrency";

// redux
import * as orderActions from "../redux/actions/order";

const dateFilter = [
  {
    id: 0,
    name: "day",
    display: "Hôm nay",
  },
  {
    id: 1,
    name: "week",
    display: "Tuần này",
  },
  {
    id: 2,
    name: "month",
    display: "Tháng này",
  },
  {
    id: 3,
    name: "year",
    display: "Năm này",
  },
];

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

const StatisticScreen = (props) => {
  const { navigation, route, products, orders, getOrders } = props;
  const [user, setUser] = useState();
  const [choose, setChoose] = useState("user");
  const [active, setActive] = useState(false);
  const [filterIndex, setFilterIndex] = useState(0);
  const [productSell, setProductSell] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState();

  const ordersFiltered = orders.filter((order) => {
    let dateFormat = dateFilter.find((i) => i.id === filterIndex).name;
    return (
      moment(new Date()).diff(order.dateOrdered, dateFormat.toString()) === 0
    );
  });

  const userFiltered = user
    ? user.filter((user) => {
        let dateFormat = dateFilter.find((i) => i.id === filterIndex).name;
        return (
          moment(new Date()).diff(user.dateCreated, dateFormat.toString()) === 0
        );
      })
    : [];

  const productsFiltered = products.filter(
    (product) => product.countInStock <= 10
  );

  const getUser = async () => {
    const res = await fetchUser();
    if (res.ok) setUser(res.data.filter((user) => !user.isAdmin));
  };

  const getProductSell = async (orders, index = 0) => {
    const ordersFiltered = orders.filter((order) => {
      let dateFormat = dateFilter.find((i) => i.id === index).name;
      return (
        moment(new Date()).diff(order.dateOrdered, dateFormat.toString()) === 0
      );
    });
    const ordersDone = ordersFiltered.filter(
      (order) => order.status === "Done"
    );

    let productSellTemp = [];

    for (let i = 0; i < ordersDone.length; i++) {
      const order = ordersDone[i];

      setLoading(true);
      const res = await getUserOrder(order._id);
      setLoading(false);

      if (res.ok) {
        res.data.orderItems.forEach((orderItem) => {
          let find = false;
          let productObj = {
            product: orderItem.product,
            count: orderItem.quantity,
          };

          for (let i = 0; i < productSellTemp.length; i++) {
            if (productSellTemp[i].product.id === productObj.product.id) {
              find = true;
              productSellTemp[i].count =
                productSellTemp[i].count + productObj.count;
              break;
            }
          }

          if (!find) productSellTemp.push(productObj);
        });
      }
    }

    setProductSell(productSellTemp);
  };

  useEffect(() => {
    getUser();
    getOrders(route.params.user, getProductSell);
  }, []);

  const StatisticList = () => (
    <View style={styles.boxContainer}>
      <TouchableNativeFeedback onPress={() => setChoose("user")}>
        <View
          style={{
            ...styles.box,
            backgroundColor:
              choose === "user"
                ? colorRandom(0.3, 0.99).hexString()
                : colors.white,
          }}
        >
          <Text style={styles.label}>Khách hàng</Text>
          <Text style={styles.count}>{user ? user.length : 0}</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => setChoose("order")}>
        <View
          style={{
            ...styles.box,
            backgroundColor:
              choose === "order"
                ? colorRandom(0.3, 0.99).hexString()
                : colors.white,
          }}
        >
          <Text style={styles.label}>Đơn hàng</Text>
          <Text style={styles.count}>{orders.length}</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => setChoose("product")}>
        <View
          style={{
            ...styles.box,
            backgroundColor:
              choose === "product"
                ? colorRandom(0.3, 0.99).hexString()
                : colors.white,
          }}
        >
          <Text style={styles.label}>Sản Phẩm</Text>
          <Text style={styles.count}>{products.length}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );

  const Filter = () => {
    return (
      <View
        style={{
          ...styles.filter,
          zIndex: active ? 1 : 0,
          opacity: active ? 1 : 0,
        }}
      >
        {dateFilter.map((filter, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setFilterIndex(index);
              setActive(!active);
              getProductSell(orders, index);
            }}
          >
            <Text style={styles.filterRow}>{filter.display}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!choose) {
    return (
      <View style={styles.screen}>
        <StatisticList />
      </View>
    );
  }

  if (choose === "user") {
    return (
      <View style={styles.screen}>
        <StatisticList />
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Khách hàng</Text>
            <TouchableOpacity onPress={() => setActive(!active)}>
              <Icon name="filter" backgroundColor={colors.primary} />
            </TouchableOpacity>
            <Filter />
          </View>
          <View style={styles.content}>
            <Text style={styles.subTitle}>{`Khách hàng đăng ký ${dateFilter
              .find((i) => i.id === filterIndex)
              .display.toLowerCase()}`}</Text>
            <View style={styles.contentBox}>
              <Text style={styles.boxLabel}>
                {userFiltered.length} Khách hàng
              </Text>
              <FlatList
                data={userFiltered.sort((a, b) => b.order - a.order)}
                keyExtractor={(user) => user.id.toString()}
                renderItem={({ item }) => (
                  <ListItem
                    title={item.email}
                    IconComponent={
                      <Icon
                        name="account"
                        backgroundColor={colorRandom().hexString()}
                      />
                    }
                  />
                )}
                refreshing={loading}
                ItemSeparatorComponent={ListItemSeparator}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (choose === "order") {
    const totalFiltered = (orders) => {
      let total = 0;

      let ordersDone = orders.filter((order) => order.status === "Done");
      ordersDone.forEach((order) => (total += parseInt(order.totalPrice)));

      return total;
    };

    const totalFilteredByDate = (orders) => {
      let ordersFilteredByDate = orders.filter(
        (order) =>
          moment(order.dateOrdered).toDate().getTime() >
            moment(fromDate).toDate().getTime() &&
          moment(order.dateOrdered).toDate().getTime() <=
            moment(toDate).toDate().getTime()
      );
      return totalFiltered(ordersFilteredByDate);
    };

    const onChange = (event, selectedDate) => {
      let currentDate;

      if (show === "from") {
        currentDate = selectedDate || fromDate;
        setFromDate(currentDate);
      } else {
        currentDate = selectedDate || toDate;
        setToDate(currentDate);
      }

      setShow(Platform.OS === "ios");
    };

    const showMode = (currentMode, type) => {
      type === "from" ? setShow("from") : setShow("to");
      setMode(currentMode);
    };

    const showDatepicker = (type) => {
      showMode("date", type);
    };

    return (
      <View style={styles.screen}>
        <StatisticList />
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Đơn hàng</Text>
            <TouchableOpacity onPress={() => setActive(!active)}>
              <Icon name="filter" backgroundColor={colors.primary} />
            </TouchableOpacity>
            <Filter />
          </View>
          <View style={styles.content}>
            <Text style={styles.subTitle}>{`Đơn hàng ${dateFilter
              .find((i) => i.id === filterIndex)
              .display.toLowerCase()}`}</Text>
            <View style={styles.contentBox}>
              <Text style={styles.boxLabel}>
                {ordersFiltered.length} Đơn hàng
              </Text>
              <FlatList
                style={{ maxHeight: 220 }}
                data={ordersFiltered}
                keyExtractor={(order) => order.id.toString()}
                renderItem={({ item, index }) => (
                  <ListItem
                    titleColor={colorStatus[item.status]}
                    title={
                      filterStatus.find((i) => i.name === item.status).display
                    }
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
                        isAdmin: route.params.user.isAdmin,
                        fetchOrders: async () => getOrders(route.params.user),
                      })
                    }
                  />
                )}
                ItemSeparatorComponent={ListItemSeparator}
              />
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>{`Doanh thu ${dateFilter
                .find((i) => i.id === filterIndex)
                .display.toLowerCase()}`}</Text>
              <Text style={styles.totalPrice}>
                {formatVND(totalFiltered(ordersFiltered))}
              </Text>
            </View>
            <Text style={[styles.subTitle, { color: colors.secondary }]}>
              Doanh Thu
            </Text>
            <View style={styles.contentBox}>
              <View style={styles.totalBox}>
                <View>
                  <Button
                    onPress={() => showDatepicker("from")}
                    title="Từ ngày"
                  />
                  <Text style={{ marginTop: 10 }}>
                    {moment(fromDate).toDate().toDateString()}
                  </Text>
                </View>

                <View>
                  <Button
                    onPress={() => showDatepicker("to")}
                    title="Đến ngày"
                  />
                  <Text style={{ marginTop: 10 }}>
                    {moment(toDate).toDate().toDateString()}
                  </Text>
                </View>
              </View>
              {show === "from" && (
                <DateTimePicker
                  testID="dateTimePickerFrom"
                  value={fromDate}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
              {show === "to" && (
                <DateTimePicker
                  testID="dateTimePickerTo"
                  value={toDate}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Doanh thu lọc</Text>
              <Text style={styles.totalPrice}>
                {formatVND(totalFilteredByDate(orders))}
              </Text>
            </View>
            {/* <View style={styles.totalBox}>
              <Text
                style={{
                  ...styles.totalLabel,
                  fontSize: 20,
                  color: colors.secondary,
                }}
              >
                Tổng Doanh Thu
              </Text>
              <Text
                style={{
                  ...styles.totalPrice,
                  fontSize: 22,
                }}
              >
                {formatVND(totalFiltered(orders))}
              </Text>
            </View> */}
          </View>
        </View>
      </View>
    );
  }

  if (choose === "product") {
    return (
      <View style={styles.screen}>
        <StatisticList />
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sản phẩm</Text>
            <TouchableOpacity onPress={() => setActive(!active)}>
              <Icon name="filter" backgroundColor={colors.primary} />
            </TouchableOpacity>
            <Filter />
          </View>
          <View style={styles.content}>
            <Text style={styles.subTitle}>
              {`Sản phẩm đã bán ${dateFilter
                .find((i) => i.id === filterIndex)
                .display.toLowerCase()}`}
            </Text>
            {loading ? (
              <View style={styles.contentBox}>
                <ActivityIndicator size="large" color={colors.secondary} />
              </View>
            ) : (
              <View style={styles.contentBox}>
                <Text style={styles.boxLabel}>
                  {productSell.length} Sản phẩm
                </Text>
                <FlatList
                  nestedScrollEnabled
                  style={{ maxHeight: 200 }}
                  data={productSell}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <ListItem
                      title={item.product.name}
                      subTitle={`đã bán ${item.count}`}
                      image={item.product.images[0]}
                    />
                  )}
                  ItemSeparatorComponent={ListItemSeparator}
                />
              </View>
            )}

            <Text style={styles.subTitle}>Sản phẩm sắp hết hàng</Text>
            <View style={styles.contentBox}>
              <Text style={styles.boxLabel}>
                {productsFiltered.length} Sản phẩm
              </Text>
              <FlatList
                nestedScrollEnabled
                style={{ maxHeight: 200 }}
                data={productsFiltered}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <ListItem
                    title={item.name}
                    subTitle={`${formatVND(item.price)} x ${item.countInStock}`}
                    image={item.images[0]}
                    onPress={() => navigation.navigate("EditProduct", { item })}
                  />
                )}
                ItemSeparatorComponent={ListItemSeparator}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
};

export default connect(
  (state) => ({ products: state.products, orders: state.orders }),
  (dispatch) => ({
    getOrders: async (user, setOrdersFiltered, getProductSell) =>
      dispatch(orderActions.getOrders(user, setOrdersFiltered, getProductSell)),
  })
)(StatisticScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: colors.light,
    minHeight: Dimensions.get("screen").height,
  },

  boxContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.light,
  },
  box: {
    backgroundColor: colors.white,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: "30%",
    borderRadius: 5,
    elevation: 1,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  label: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
  },
  count: {
    fontSize: 25,
    color: colors.secondary,
  },
  container: {
    marginTop: 20,
    padding: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    color: colors.secondary,
  },
  filter: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: colors.white,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterRow: {
    paddingVertical: 10,
    fontSize: 18,
  },
  subTitle: {
    color: colors.black,
    fontSize: 18,
    marginTop: 10,
  },
  contentBox: {
    backgroundColor: colors.white,
    marginTop: 10,
    padding: 5,
  },
  boxLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalBox: {
    backgroundColor: colors.white,
    marginTop: 10,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    color: colors.medium,
  },
  totalPrice: {
    fontSize: 18,
    color: colors.primary,
  },
});
