import React, { useState } from "react";
import { StyleSheet, Text, Pressable, View, Modal } from "react-native";
import UserProfile from "../user/user-profile";

const TestingScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>Open Modal</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={toggleModal}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>this is a modal</Text>
            <Pressable style={styles.button} onPress={toggleProfile}>
              <Text style={styles.buttonText}>
                {showProfile ? "Hide Profile" : "Show Profile"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.closeButton]}
              onPress={toggleModal}
            >
              <Text style={styles.buttonText}>Close Modal</Text>
            </Pressable>
          </View>
        </View>
        <UserProfile showProfile={showProfile} toggleProfile={toggleProfile} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#b00020",
  },
});

export default TestingScreen;
