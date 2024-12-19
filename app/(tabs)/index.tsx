import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "@/hooks/user/UserContex";
import ModalPost from "@/components/ModalPost";
import { useState } from "react";
import PetPosts from "@/components/PetPosts";

export default function Index() {
  const { profilePicture } = useUser();
  const [modalPostVisible, setModalPostVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image
            style={styles.image}
            source={
              profilePicture
                ? { uri: profilePicture }
                : require("@/assets/images/defaultProfile.jpg")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalPostVisible(true)}>
          <Ionicons
            name="add"
            size={30}
            color="black"
            style={{ fontWeight: "bold" }}
          />
        </TouchableOpacity>
      </View>

      <PetPosts />

      <ModalPost
        modalVisible={modalPostVisible}
        setModalVisible={setModalPostVisible}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AEEFFF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});
