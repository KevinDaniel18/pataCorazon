import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HorizontalLine from "./HorizontalLine";
import { useUser } from "@/hooks/user/UserContex";
import { useAuth } from "@/hooks/auth/AuthContext";

export default function UserConfiguration() {
  const { userData } = useUser();
  const { onLogout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.information}>Información</Text>

      <HorizontalLine />

      <TouchableOpacity style={styles.userInfo}>
        <View style={styles.userProperty}>
          <View style={styles.icon}>
            <AntDesign name="user" size={24} color="gray" />
          </View>
          <Text>Name</Text>
        </View>
        <Entypo name="chevron-thin-right" size={24} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.userInfo}>
        <View style={styles.userProperty}>
          <View style={styles.icon}>
            <Fontisto name="email" size={24} color="gray" />
          </View>
          <Text>Correo</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "gray" }}>{userData?.email}</Text>
          <Entypo name="chevron-thin-right" size={24} color="gray" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.userInfo}>
        <View style={styles.userProperty}>
          <View style={styles.icon}>
            <Ionicons name="location-outline" size={24} color="gray" />
          </View>
          <Text>Ubicación</Text>
        </View>
        <Entypo name="chevron-thin-right" size={24} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.userInfo}>
        <View style={styles.userProperty}>
          <View style={styles.icon}>
            <MaterialIcons name="security" size={24} color="gray" />
          </View>
          <Text>Cambiar contraseña</Text>
        </View>
        <Entypo name="chevron-thin-right" size={24} color="gray" />
      </TouchableOpacity>

      <HorizontalLine />

      <TouchableOpacity style={styles.userInfo}>
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
