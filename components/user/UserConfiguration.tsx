import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HorizontalLine from "../HorizontalLine";
import { useUser } from "../../hooks/user/UserContex";
import { useAuth } from "../../hooks/auth/AuthContext";
import { useRouter } from "expo-router";

export default function UserConfiguration() {
  const { userData } = useUser();
  const { onLogout } = useAuth();
  const route = useRouter();
  const options = ["Nombre", "Correo", "Ubicación", "Cambiar contraseña"];
  function navigateToUpdateUser(title: string) {
    route.push({ pathname: "/user/update-user", params: { title } });
  }
  return (
    <View style={[styles.container]}>
      <Text style={styles.information}>Información</Text>

      <HorizontalLine />

      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.userInfo}
          onPress={() => navigateToUpdateUser(option)}
        >
          <View style={styles.userProperty}>
            <View style={styles.icon}>
              {index === 0 && <AntDesign name="user" size={24} color="gray" />}
              {index === 1 && <Fontisto name="email" size={24} color="gray" />}
              {index === 2 && (
                <Ionicons name="location-outline" size={24} color="gray" />
              )}
              {index === 3 && (
                <MaterialIcons name="security" size={24} color="gray" />
              )}
            </View>
            <Text>{option}</Text>
          </View>

          {index === 1 ? (
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "gray" }}>{userData?.email}</Text>
              <Entypo name="chevron-thin-right" size={24} color="gray" />
            </View>
          ) : (
            <Entypo name="chevron-thin-right" size={24} color="gray" />
          )}
        </TouchableOpacity>
      ))}

      <HorizontalLine />

      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => route.push("/notifications/allow-notifications")}
      >
        <View style={styles.userProperty}>
          <View style={styles.icon2}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </View>
          <Text>Notificaciones</Text>
        </View>
        <Entypo name="chevron-thin-right" size={24} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogout} style={styles.logoutContainer}>
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 3,
    marginBottom: 110,
  },
  information: {
    fontWeight: "bold",
    fontSize: 20,
  },
  userInfo: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userProperty: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  icon: {
    backgroundColor: "#B5EAD7",
    padding: 8,
    borderRadius: 5,
  },
  icon2: {
    backgroundColor: "#FF9AA2",
    padding: 8,
    borderRadius: 5,
  },
  logoutContainer: {
    marginTop: 20,
    width: "100%",
    padding: 15,
    borderRadius: 20,
    backgroundColor: "pink",
  },
});
