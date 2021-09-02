import client from "./client";

const endpoint = "/orders";

export const fetchOrders = () => client.get(`${endpoint}`);

export const getUserOrder = (ID) => client.get(`${endpoint}/${ID}`);

export const updateStatus = (ID, data) => client.put(`${endpoint}/${ID}`, data);

export const deleteOrder = (ID) => client.delete(`${endpoint}/${ID}`);

export const getUserOrders = (usrID) =>
  client.get(`${endpoint}/get/userorders/${usrID}`);

export const addOrder = (data, onUploadProgress) =>
  client.post(`${endpoint}`, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
