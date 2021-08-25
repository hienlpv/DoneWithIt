import client from "./client";

const endpoint = "/categories";

export const getCategories = () => client.get(endpoint);

export const addCategory = (data) => client.post(endpoint, data);

export const deleteCategory = (id) => client.delete(`${endpoint}/${id}`);
