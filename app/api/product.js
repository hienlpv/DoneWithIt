import client from "./client";

const endpoint = "/products";

export const getProducts = () => client.get(endpoint);

export const addProducts = (data, onUploadProgress) =>
  client.post(endpoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });

export const deleteProduct = (id) => client.delete(`${endpoint}/${id}`);
