import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  DECREASE_FROM_CART,
} from "../constants";

export const addToCart = (payload) => async (dispatch) => {
  dispatch({
    type: ADD_TO_CART,
    payload,
  });
};

export const decreaseFromCart = (payload) => async (dispatch) => {
  dispatch({
    type: DECREASE_FROM_CART,
    payload,
  });
};

export const removeFromCart = (payload) => {
  return {
    type: REMOVE_FROM_CART,
    payload,
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};
