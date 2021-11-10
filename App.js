import React, { useState } from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import Toast from "react-native-toast-message";
import AppLoading from "expo-app-loading";
import jwtDecode from "jwt-decode";

// redux
import store from "./app/redux/store";

// navigation
import { navigationRef } from "./app/navigation/rootNavigation";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";

// component
import OfflineNotice from "./app/components/OfflineNotice";

// auth
import authStorage from "./app/auth/storage";
import AuthContext from "./app/auth/context";

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
        {/* <OfflineNotice /> */}
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </Provider>
    </AuthContext.Provider>
  );
}
