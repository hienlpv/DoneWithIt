import client from "./client";

const endpoint = "/orders";

export const addOrder = (data) => client.post(`${endpoint}`, data);

export const getUserOrders = (usrID) =>
  client.get(`${endpoint}/get/userorders/${usrID}`);
