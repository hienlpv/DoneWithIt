import client from "./client";

const endpoint = "/orders";

export const fetchOrders = () => client.get(`${endpoint}`);

export const addOrder = (data, onUploadProgress) =>
  client.post(`${endpoint}`, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });

export const getUserOrders = (usrID) =>
  client.get(`${endpoint}/get/userorders/${usrID}`);

export const getUserOrder = (ID) => client.get(`${endpoint}/${ID}`);

export const updateStatus = (ID, data) => client.put(`${endpoint}/${ID}`, data);
