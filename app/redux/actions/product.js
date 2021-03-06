import Toast from "react-native-toast-message";
import { Alert } from "react-native";

import {
  deleteProduct,
  getProducts,
  addProduct,
  updateProduct,
} from "../../api/product";
import {
  FETCH_PRODUCT,
  DELETE_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
} from "../constants";

export const fetchProducts = (setFilteredProducts) => async (dispatch) => {
  let payload = [];
  const result = await getProducts();
  if (result.ok) payload = result.data;
  if (setFilteredProducts) setFilteredProducts(payload);
  dispatch({
    type: FETCH_PRODUCT,
    payload,
  });
};

export const addProducts = (data, setProgress) => async (dispatch) => {
  const res = await addProduct(data, (progress) => setProgress(progress));
  if (!res.ok) {
    Alert.alert("ERROR", "Tạm thời không thử thực hiện thao tác này!");
    return;
  } else
    Toast.show({
      text1: "Successfully",
      text2: "Sản phẩm đã đã thêm thành công!",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
  dispatch({
    type: ADD_PRODUCT,
    payload: res.data,
  });
};

export const updateProducts = (id, data, setProgress) => async (dispatch) => {
  const res = await updateProduct(id, data, (progress) =>
    setProgress(progress)
  );
  if (!res.ok) {
    Alert.alert("ERROR", "Tạm thời không thử thực hiện thao tác này!");
    return;
  } else
    Toast.show({
      text1: "Successfully",
      text2: "Sản phẩm đã được cập nhật thành công!",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
  dispatch({
    type: UPDATE_PRODUCT,
    payload: res.data,
  });
};

export const deleteProducts = (id) => async (dispatch) => {
  let res = await deleteProduct(id);
  if (!res.ok) return Alert.alert("ERROR", "Không thể xoá sản phẩm này!");
  dispatch({
    type: DELETE_PRODUCT,
    payload: id,
  });
};
