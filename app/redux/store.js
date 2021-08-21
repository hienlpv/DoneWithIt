import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import cartItems from "./reducers/cartItem";
import products from "./reducers/product";

const reducers = combineReducers({
  cartItems,
  products,
});

const store = createStore(reducers, compose(applyMiddleware(thunk)));

export default store;
