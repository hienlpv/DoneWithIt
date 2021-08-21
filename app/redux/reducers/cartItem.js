import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "../constants";

const addToCart = (state, payload) => {
  if (state.length === 0) return [...state, { ...payload, count: 1 }];

  let newState = [...state];
  let find = false;
  let i;

  state.forEach((cartItem, index) => {
    if (cartItem.id === payload.id) {
      find = true;
      i = index;
    }
  });

  if (find) newState[i].count++;
  else newState.push({ ...payload, count: 1 });

  return newState;
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
