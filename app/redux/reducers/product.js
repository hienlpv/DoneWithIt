import { FETCH_PRODUCT, DELETE_PRODUCT } from "../constants";

const products = (state = [], action) => {
  switch (action.type) {
    case FETCH_PRODUCT:
      return action.payload;
    case DELETE_PRODUCT:
      return state.filter((product) => product.id !== action.payload);
  }
  return state;
};

export default products;
