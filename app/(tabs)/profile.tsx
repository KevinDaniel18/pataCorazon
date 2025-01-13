import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import Avatar from "@/components/Avatar";
import { useUser } from "@/hooks/user/UserContex";
import UserConfiguration from "../../components/user/UserConfiguration";

const ProfileScreen = () => {
  const { userData } = useUser();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar size={100} url={userData?.profilePicture!} />
        <View style={styles.userInfo}>
          <Text style={styles.text}>{userData?.name}</Text>
          <Text style={{color: "gray"}}>
            {userData?.city} - {userData?.country}
          </Text>
          {/* <TouchableOpacity
            style={{ padding: 10, backgroundColor: "#fff", borderRadius: 10 }}
          >
            <Text>Cambiar foto de perfil</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <UserConfiguration/>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#AEEFFF",
    backgroundColor: "white",
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    gap: 20,
    padding: 20
  },
  userInfo: {
    rowGap: 5,
  },
  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
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
