import { create } from "apisauce";

import authStorage from "../auth/storage";

const apiClient = create({
  baseURL: "https://easy-shop-server-api.herokuapp.com/api/v1",
});

apiClient.addAsyncRequestTransform(async (request) => {
  const token = await authStorage.getToken();
  if (!token) return;

  const authToken = `Bearer ${token}`;
  request.headers["Authorization"] = authToken;
});

export default apiClient;
