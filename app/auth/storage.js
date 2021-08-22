import * as AuthStorage from "expo-secure-store";

const key = "AuthToken";

const storeToken = async (token) => {
  try {
    await AuthStorage.setItemAsync(key, token);
  } catch (error) {
    console.log("Can't store this token", error);
  }
};

const getToken = async () => {
  try {
    return await AuthStorage.getItemAsync(key);
  } catch (error) {
    console.log("Can't get token", error);
  }
};

const removeToken = async () => {
  try {
    await AuthStorage.deleteItemAsync(key);
  } catch (error) {
    console.log("Can't remove token", error);
  }
};

export default { storeToken, getToken, removeToken };
