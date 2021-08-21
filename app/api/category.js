import client from "./client";

const endpoint = "/categories";

export const getCategories = () => client.get(endpoint);
