import {
  View,
  Text,
  StyleSheet,
  Switch,
  Linking,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { disableNotifications, updateNotificationToken } from "@/api/endpoint";
import { usePushNotifications } from "@/notifications/setupNotifications";

export default function AllowNotifications() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const storedState = await SecureStore.getItemAsync("notificationsEnabled");
    const { status } = await Notifications.getPermissionsAsync();

    if (status === "denied") {
      setIsEnabled(false);
      setHasPermission(false);
      await SecureStore.setItemAsync("notificationsEnabled", "false");
      return;
    }

    if (storedState !== null) {
      setIsEnabled(storedState === "true");
    } else {
      const { status } = await Notifications.getPermissionsAsync();
      await SecureStore.setItemAsync(
        "notificationsEnabled",
        status === "granted" ? "true" : "false"
      );
    }
  };

  const openSettings = async () => {
    if (Platform.OS === "ios") {
      await Linking.openSettings();
    } else {
      await Linking.openSettings();
    }
  };

  const toggleSwitch = async () => {
    if (!hasPermission && !isEnabled) {
      return;
    }
    if (isEnabled) {
      await cancelAllNotifications();
      setIsEnabled(false);
      await SecureStore.setItemAsync("notificationsEnabled", "false");
      await disableNotifications();
    } else {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        setIsEnabled(true);
        setHasPermission(true);
        await SecureStore.setItemAsync("notificationsEnabled", "true");
        if (expoPushToken) {
          await updateNotificationToken({ expoPushToken });
        }
      } else {
        setHasPermission(false);
      }
    }
  };

  async function cancelAllNotifications() {
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: false,
        allowSound: false,
        allowBadge: false,
      },
      android: {
        allowAlert: false,
        allowSound: false,
        allowBadge: false,
      },
    });

    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Permisos revocados y notificaciones canceladas");
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Permitir notificaciones</Text>
        <Text style={styles.text}>
          Recibirás notificaciones push como solicitudes de adopción, amistad y
          mensajes de usuarios.
        </Text>
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>{isEnabled ? "Activado" : "Desactivado"}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#4CAF50" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          disabled={!hasPermission && !isEnabled}
        />
      </View>
      {!hasPermission && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Las notificaciones están desactivadas. Para activarlas, necesitas
            dar permisos en notificaciones en la
            <Text style={styles.link} onPress={openSettings}>
              {" "}
              configuración de la aplicacion
            </Text>
            .
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    marginTop: 20,
    color: "gray",
    textAlign: "center",
    lineHeight: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  switchText: {
    fontSize: 16,
  },
  warningContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
  },
  warningText: {
    color: "#E65100",
    fontSize: 14,
    textAlign: "center",
  },
  link: {
    color: "#1976D2",
    textDecorationLine: "underline",
  },
});
