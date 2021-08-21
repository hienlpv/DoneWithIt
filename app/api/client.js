import { create } from "apisauce";
import cache from "../utility/cache";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTFiYTY5NTM4MDlkNDAwMjM1NGQwZGYiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2Mjk1NDA2NDYsImV4cCI6MTYyOTYyNzA0Nn0.lDZqDe0VWI2x_bWiUDIcu7q-wRUmuhbnBRzebAhf3Ms";

const apiClient = create({
  baseURL: "https://easy-shop-server-api.herokuapp.com/api/v1",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

export default apiClient;
