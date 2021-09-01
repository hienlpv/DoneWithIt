import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./app/redux/store";
import AppLoading from "expo-app-loading";
import Toast from "react-native-toast-message";
import { LogBox } from "react-native";

import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import jwtDecode from "jwt-decode";
import { navigationRef } from "./app/navigation/rootNavigation";

export default function App() {
  LogBox.ignoreAllLogs();

  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const getToken = async () => {
    const token = await authStorage.getToken();
    if (!token) return;
    setUser(jwtDecode(token).user);
  };

  if (!isReady)
    return (
      <AppLoading
        startAsync={getToken}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Provider store={store}>
        <OfflineNotice />
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </Provider>
    </AuthContext.Provider>
  );
}
