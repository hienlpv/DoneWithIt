import { create } from "apisauce";

import authStorage from "../auth/storage";

const devURL = "http://192.168.0.106:3000/api/v1";
const prodURL = "https://easy-shop-server-api.herokuapp.com/api/v1";

const apiClient = create({
  baseURL: prodURL,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const token = await authStorage.getToken();
  if (!token) return;

  const authToken = `Bearer ${token}`;
  request.headers["Authorization"] = authToken;
});

export default apiClient;
