import Toast from "react-native-toast-message";

import {
  fetchOrders,
  getUserOrders,
  addOrder,
  updateOrder,
} from "../../api/order";
import { FETCH_ORDER, ADD_ORDER, UPDATE_ORDER } from "../constants";

export const getOrders =
  (user, setOrdersFiltered, getProductSell) => async (dispatch) => {
    const { isAdmin, id } = user;
    let payload = [];
    const result = isAdmin ? await fetchOrders() : await getUserOrders(id);
    if (result.ok) payload = result.data;
    if (setOrdersFiltered) setOrdersFiltered(payload);
    if (getProductSell) getProductSell(payload);
    dispatch({
      type: FETCH_ORDER,
      payload,
    });
  };

export const addOrders = (data, setProgress) => async (dispatch) => {
  const res = await addOrder(data, (progress) => setProgress(progress));
  if (!res.ok) {
    return Toast.show({
      type: "error",
      position: "top",
      text1: "Fail",
      text2: "Không thể tạo đơn hàng",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
    });
  } else
    Toast.show({
      type: "success",
      position: "top",
      text1: "Successfully",
      text2: "Đơn hàng của bạn đã được tạo",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
    });
  dispatch({
    type: ADD_ORDER,
    payload: res.data,
  });
};

export const updateStatus = (id, data) => async (dispatch) => {
  const res = await updateOrder(id, data);
  if (!res.ok) {
    return Toast.show({
      type: "error",
      position: "top",
      text1: "Fail",
      text2: "Cập nhật đơn hàng thất bại!",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
  } else
    Toast.show({
      text1: "Successfully",
      text2: "Đơn hàng đã được cập nhật thành công!",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
  dispatch({
    type: UPDATE_ORDER,
    payload: { id, data },
  });
};

export const deleteProducts = (id) => async (dispatch) => {
  await deleteProduct(id);
  dispatch({
    type: DELETE_PRODUCT,
    payload: id,
  });
};
