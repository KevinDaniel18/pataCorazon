import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { ProfileModalProps } from "@/types/profileModalTypes";
import { Pets } from "@/types/comments";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AccordionItem from "./AccordionItem";
import ModalChat from "./chat/ModalChat";

const DEFAULT_PROFILE_IMAGE = require("@/assets/images/defaultProfile.jpg");

export default function ProfileModal({
  showProfile,
  toggleProfile,
}: ProfileModalProps) {
  const [modalVisible, setModalVisible] = useState(showProfile);
  const [showChat, setShowChat] = useState(false);
  const slideAnim = useRef(new Animated.Value(-500)).current;
  const { userName, userImage, userId, city, country, pet } =
    useLocalSearchParams();
  const [storedUserId, setStoredUserId] = useState<number | undefined>(
    undefined
  );
  const petArray = pet ? JSON.parse(Array.isArray(pet) ? pet[0] : pet) : [];
  const pets = Array.isArray(petArray) ? petArray : [petArray];

  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };

  useEffect(() => {
    async function getId() {
      const getStoredId = await SecureStore.getItemAsync("USER_ID");
      setStoredUserId(Number(getStoredId));
    }
    getId();
  }, [storedUserId]);

  useEffect(() => {
    if (showProfile) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [showProfile]);

  const handleOpenChat = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setShowChat(true);
    });
  };

  const handleCloseChat = () => {
    setShowChat(false);
    toggleProfile();
  };

  const isValidURL = (url: string | string[]) => {
    return typeof url === "string" && url.startsWith("http");
  };

  const insets = useSafeAreaInsets();

  return (
    <>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          toggleProfile();
        }}
        animationType="none"
        statusBarTranslucent
      >
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.profileOverlay,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <View
              style={{
                marginTop: insets.top,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={toggleProfile}>
                <AntDesign name="arrowleft" size={28} color="black" />
              </TouchableOpacity>
              {Number(userId) === storedUserId && (
                <TouchableOpacity
                  onPress={() => showToast("Es una vista previa de tu perfil")}
                >
                  <AntDesign name="info" size={28} color="black" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.profile}>
              <Image
                style={styles.userImage}
                source={
                  isValidURL(userImage)
                    ? { uri: userImage }
                    : DEFAULT_PROFILE_IMAGE
                }
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userDescription}>
                  {city} - {country}
                </Text>
              </View>
              {Number(userId) !== storedUserId && (
                <TouchableOpacity onPress={handleOpenChat}>
                  <Feather name="message-square" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ marginTop: 20 }}>
              {/*Un acordion para Mascotas*/}
              <AccordionItem
                title="Mascotas"
                headerIcon={
                  <MaterialIcons name="pets" size={24} color="black" />
                }
                headerRightContent={<Text>({pets.length})</Text>}
              >
                {pets.map(({ id, name, imageUrl }: Pets) => (
                  <View key={id} style={styles.petItem}>
                    <Image
                      style={styles.petImage}
                      height={60}
                      width={60}
                      source={{ uri: imageUrl }}
                    />
                    <Text style={styles.petName}>Nombre: {name}</Text>
                  </View>
                ))}
              </AccordionItem>
              {/*Un acordion para Adopciones*/}
              <AccordionItem title="Adopciones">
                <Text>Adopciones</Text>
              </AccordionItem>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <ModalChat
        receiverId={userId}
        userName={userName}
        visible={showChat}
        onClose={handleCloseChat}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileOverlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    elevation: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profile: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  userDescription: {
    fontSize: 14,
    color: "#777",
  },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  petImage: {
    borderRadius: 30,
  },
  petName: {
    fontSize: 16,
  },
});
