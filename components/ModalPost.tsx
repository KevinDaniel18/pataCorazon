import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PetForm } from "./pet/PetForm";

const ModalPost = ({ modalVisible, setModalVisible }: any) => {
  const [uploadMediaVisible, setUploadMediaVisible] = useState(false);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ayúdanos a encontrar un hogar para este animal
            </Text>

            <View style={styles.modalIconContent}>
              <View style={styles.iconWrapper}>
                <TouchableOpacity
                  style={styles.iconContent}
                  onPress={() => {
                    setModalVisible(false);
                    setUploadMediaVisible(true);
                  }}
                >
                  <MaterialIcons name="pets" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.iconText}>Empezar</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <AntDesign name="close" size={34} color="#FF6347" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={uploadMediaVisible}
        onRequestClose={() => {
          setUploadMediaVisible(!uploadMediaVisible);
        }}
      >
        <View style={styles.modalView}>
          <PetForm setUploadMediaVisible={setUploadMediaVisible} uploadMediaVisible={uploadMediaVisible} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    //backgroundColor: "#AEEFFF",
    backgroundColor: "white",
    borderRadius: 0,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalIconContent: {
    marginTop: 15,
    flexDirection: "row",
    gap: 20,
  },
  iconWrapper: {
    alignItems: "center",
  },
  iconContent: {
    backgroundColor: "#8EDCBF",
    padding: 20,
    borderRadius: 20,
  },
  iconText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  closeButton: {
    position: "absolute",
    bottom: 0,
    marginBottom: 50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  uploadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  uploadTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  uploadButton: {
    padding: 8,
  },
  uploadInput: {
    backgroundColor: "#333",
    color: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default ModalPost;
