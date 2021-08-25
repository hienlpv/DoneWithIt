import Toast from "react-native-toast-message";
import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "../constants";

const addToCart = (state, payload) => {
  if (payload.countInStock === 0) {
    Toast.show({
      type: "error",
      position: "top",
      text1: "Fail",
      text2: "Sản phẩm này đã hết hàng",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
    return state;
  }
  if (state.length === 0) {
    Toast.show({
      type: "success",
      position: "top",
      text1: "Successfully",
      text2: `${payload.name} đã thêm vào giỏ hàng`,
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
    return [...state, { ...payload, count: 1 }];
  }

  let newState = [...state];
  let find = false;
  let i;

  state.forEach((cartItem, index) => {
    if (cartItem.id === payload.id) {
      find = true;
      i = index;
    }
  });

  if (!find) {
    Toast.show({
      type: "success",
      position: "top",
      text1: "Successfully",
      text2: `${payload.name} đã thêm vào giỏ hàng`,
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
    return newState.push({ ...payload, count: 1 });
  }

  if (state[i].count < payload.countInStock) {
    Toast.show({
      type: "success",
      position: "top",
      text1: "Successfully",
      text2: `${payload.name} đã thêm vào giỏ hàng`,
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
    newState[i].count++;
    return newState;
  } else {
    Toast.show({
      type: "error",
      position: "top",
      text1: "Fail",
      text2: "Đã vượt quá số lượng có thể thêm vào giỏ hàng",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
    return newState;
  }
};

const cartItems = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return addToCart(state, action.payload);
    case REMOVE_FROM_CART:
      return state.filter((cartItem) => cartItem !== action.payload);
    case CLEAR_CART:
      return (state = []);
  }
  return state;
};

export default cartItems;
