import client from "./client";

const endpoint = "/products";

export const getProducts = () => client.get(endpoint);

export const addProduct = (data, onUploadProgress) =>
  client.post(endpoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });

export const updateProduct = (id, data, onUploadProgress) =>
  client.put(`${endpoint}/${id}`, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });

export const deleteProduct = (id) => client.delete(`${endpoint}/${id}`);
