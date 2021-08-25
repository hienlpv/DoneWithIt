import {
  FETCH_PRODUCT,
  DELETE_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
} from "../constants";

const products = (state = [], action) => {
  switch (action.type) {
    case FETCH_PRODUCT:
      return action.payload;
    case ADD_PRODUCT:
      return [...state, action.payload];
    case UPDATE_PRODUCT:
      return [
        ...state.filter((product) => product.id !== action.payload.id),
        action.payload,
      ];
    case DELETE_PRODUCT:
      return state.filter((product) => product.id !== action.payload);
  }
  return state;
};

export default products;
