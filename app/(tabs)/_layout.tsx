import { useAuth } from "@/hooks/auth/AuthContext";
import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import TabBar from "@/components/TabBar";
import { UserProvider } from "@/hooks/user/UserContex";
import { useEffect } from "react";
import { usePushNotifications } from "@/notifications/setupNotifications";
import { updateNotificationToken } from "@/api/endpoint";
import { SocketProvider } from "@/hooks/socket/SocketContext";
import * as SecureStore from "expo-secure-store";

export default function AppLayout() {
  const { isLoading, authState } = useAuth();
  const { expoPushToken, notification } = usePushNotifications();

  useEffect(() => {
    async function expoPush() {
      const storedState = await SecureStore.getItemAsync(
        "notificationsEnabled"
      );

      if (expoPushToken && storedState === "true") {
        try {
          await updateNotificationToken({ expoPushToken });
          console.log("expo push token enviado:", expoPushToken);
        } catch (error) {
          console.error("Error al enviar el token:", error);
        }
      } else {
        console.log("Notificaciones desactivadas. No se envía el token.");
      }
    }
    expoPush();
  }, [expoPushToken]);

  useEffect(() => {
    if (notification) {
      console.log("Notificacion recibida", notification);
    }
  }, [notification]);

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  return authState?.authenticated ? (
    <SocketProvider>
      <UserProvider>
        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <TabBar {...props} />}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Inicio",
            }}
          />
          <Tabs.Screen
            name="pets"
            options={{
              title: "Mascotas",
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Perfil",
            }}
          />
          <Tabs.Screen
            name="testing_screen"
            options={{
              title: "Test",
            }}
          />
        </Tabs>
      </UserProvider>
    </SocketProvider>
  ) : (
    <Redirect href={"/sign-in"} />
  );
}
