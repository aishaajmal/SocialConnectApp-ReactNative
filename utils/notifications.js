import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { getMessaging, onMessage } from "firebase/messaging"; 
import { messaging } from "./firebaseConfig"; 

//  Notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

//  Register device for push notifications (Expo + FCM token)
export async function registerForPushNotificationsAsync() {
  try {
    let token;

    if (Device.isDevice) {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Permission for push notifications not granted!");
        return;
      }

      // Expo token 
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("📱 Expo Push Token:", token);

     
    } else {
      alert("Must use a physical device for push notifications");
    }

    
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  } catch (error) {
    console.error("Error registering for notifications:", error);
    return null;
  }
}

//  Local notification 
export async function sendLocalNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // immediate
  });
}

//  Listen to foreground  messages 
if (messaging) {
  try {
    onMessage(messaging, (payload) => {
      console.log("📩 FCM Message received in foreground:", payload);

      // Show as local notification
      sendLocalNotification(
        payload.notification?.title || "New Notification",
        payload.notification?.body || "You have a new update!"
      );
    });
  } catch (err) {
    console.log("FCM listener setup failed:", err.message);
  }
}
