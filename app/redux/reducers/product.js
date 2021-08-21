import { FETCH_PRODUCT } from "../constants";

const products = (state = [], action) => {
  switch (action.type) {
    case FETCH_PRODUCT:
      return action.payload;
  }
  return state;
};

export default products;
