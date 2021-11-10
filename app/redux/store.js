import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import cartItems from "./reducers/cartItem";
import products from "./reducers/product";
import orders from "./reducers/order";

const reducers = combineReducers({
  cartItems,
  products,
  orders,
});

const store = createStore(reducers, compose(applyMiddleware(thunk)));

export default store;
