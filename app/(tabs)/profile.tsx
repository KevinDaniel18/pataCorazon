import { View, StyleSheet, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import Avatar from "@/components/Avatar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useUser } from "@/hooks/user/UserContex";

const ProfileScreen = () => {
  const { userData } = useUser();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar size={150} url={userData?.profilePicture!} />
        <Text style={styles.text}>{userData?.name}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F8FF",
    padding: 20,
  },
  header: {
    alignItems: "center",
  },
  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 15,
  },
  detailsContent: {
    backgroundColor: "#332f2c",
    marginTop: 15,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginHorizontal: 10,
  },
  verticleLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090",
  },
  details: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 5,
  },
  textDetails: {
    color: "#929292",
  },
});

export default ProfileScreen;
