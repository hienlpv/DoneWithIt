import { useContext, useEffect } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { pushToken } from "../api/auth";
import AuthContext from "../auth/context";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default useNotifications = (notificationListener) => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    registerForPushNotifications(user);

    if (notificationListener)
      Notifications.addNotificationResponseReceivedListener(
        notificationListener
      );
  }, []);
};

const registerForPushNotifications = async (user) => {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    let token = (await Notifications.getExpoPushTokenAsync()).data;
    pushToken(user.id, { ...user, expoPushToken: token });
  } else {
    alert("Must use physical device for Push Notifications");
  }
};
