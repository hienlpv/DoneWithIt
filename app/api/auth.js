import client from "./client";

const endpoint = "/users";

export const login = (data) => client.post(`${endpoint}/login`, data);

export const register = (data) => client.post(`${endpoint}/register`, data);

export const getUserInfo = (usrID) => client.get(`${endpoint}/${usrID}`);

export const pushToken = (usrID, data) =>
  client.put(`${endpoint}/${usrID}`, data);
