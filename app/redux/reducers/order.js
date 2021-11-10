import {
  FETCH_ORDER,
  DELETE_ORDER,
  ADD_ORDER,
  UPDATE_ORDER,
} from "../constants";

const orders = (state = [], action) => {
  switch (action.type) {
    case FETCH_ORDER:
      return action.payload;
    case ADD_ORDER:
      return [...state, action.payload];
    case UPDATE_ORDER:
      let order = state.find((i) => i.id === action.payload.id);
      order.status = action.payload.data.status;
      order.reasonCancel = action.payload.data.reasonCancel;
      return [...state.filter((i) => i.id !== action.payload.id), order];
    case DELETE_ORDER:
      return state.filter((product) => product.id !== action.payload);
  }
  return state;
};

export default orders;
