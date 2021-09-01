import client from "./client";

const endpoint = "/users";

export const fetchUser = () => client.get(endpoint);

export const login = (data) => client.post(`${endpoint}/login`, data);

export const register = (data) => client.post(`${endpoint}/register`, data);

export const getUserInfo = (usrID) => client.get(`${endpoint}/${usrID}`);

export const pushToken = (usrID, data) =>
  client.put(`${endpoint}/${usrID}`, data);

export const updateUser = (usrID, data) =>
  client.put(`${endpoint}/${usrID}`, data);
