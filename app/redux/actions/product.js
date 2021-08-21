import { getProducts } from "../../api/product";
import { FETCH_PRODUCT } from "../constants";

export const fetchProducts = () => async (dispatch) => {
  let payload = [];
  const result = await getProducts();
  if (result.ok) payload = result.data;
  dispatch({
    type: FETCH_PRODUCT,
    payload,
  });
};
