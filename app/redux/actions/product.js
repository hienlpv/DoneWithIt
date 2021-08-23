import { getProducts } from "../../api/product";
import { FETCH_PRODUCT } from "../constants";

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
