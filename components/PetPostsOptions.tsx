import { Modal, StyleSheet, Text, View, Image, Dimensions } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useState } from "react";
import { BlurredBackground } from "./BlurredBackground";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PetPostsOptions({
  modalVisible,
  setModalVisible,
  petImage,
  ownerImage,
  ownerName,
  description,
}: any) {
  const [modalHeight, setModalHeight] = useState(0);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.overlay}>
          <View
            style={styles.modalContent}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setModalHeight(height);
            }}
          >
            <BlurredBackground
              imageUri={petImage}
              width={SCREEN_WIDTH}
              height={modalHeight}
            />
            <View style={styles.modalHeader}>
              <View style={styles.icon}>
                <AntDesign
                  name="close"
                  size={24}
                  color="black"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <Text style={styles.modalTitle}>Opciones</Text>
            </View>
            <View style={styles.postContent}>
              <View style={{ flexDirection: "row", gap: 15 }}>
                <Image style={styles.image} source={{ uri: petImage }} />
                <View style={{ justifyContent: "space-evenly" }}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Image
                      style={styles.image2}
                      source={
                        ownerImage
                          ? { uri: ownerImage }
                          : require("@/assets/images/defaultProfile.jpg")
                      }
                    />
                    <Text style={styles.text}>{ownerName}</Text>
                  </View>
                  <Text style={styles.text}>{description}</Text>
                </View>
              </View>
            </View>

            <View style={styles.options}>
              <View style={styles.optionsContent}>
                <Feather name="download" size={24} color="black" />
                <Text style={styles.textOptions}>Guardar</Text>
              </View>
              <View style={styles.optionsContent}>
                <Feather name="send" size={24} color="black" />
              </View>
              <View style={styles.optionsContent}>
                <Entypo name="link" size={24} color="black" />
              </View>
              <View
                style={[styles.optionsContent, { backgroundColor: "#F44336" }]}
              >
                <Feather name="trash" size={24} color="white" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "transparent",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 16,
  },
  icon: {
    backgroundColor: "rgba(218, 218, 218, 0.7)",
    padding: 3,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "white",
  },
  postContent: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 8,
  },
  image2: {
    height: 20,
    width: 20,
    borderRadius: 8,
  },
  options: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionsContent: {
    backgroundColor: "rgba(218, 218, 218, 0.7)",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textOptions: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "black",
  },
  text: {
    color: "white",
  },
});
