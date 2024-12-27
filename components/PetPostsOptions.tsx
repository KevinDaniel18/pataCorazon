import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { getColors } from "react-native-image-colors";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

const getLuminance = (hex: string) => {
  let r: number = parseInt(hex.slice(1, 3), 16);
  let g: number = parseInt(hex.slice(3, 5), 16);
  let b: number = parseInt(hex.slice(5, 7), 16);

  r = r / 255;
  g = g / 255;
  b = b / 255;

  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Luminosidad relativa
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export default function PetPostsOptions({
  modalVisible,
  setModalVisible,
  petImage,
  ownerImage,
  ownerName,
  description,
  petId,
  deletePost,
  userId,
  ownerId,
  imageUrl,
}: any) {
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#000000");
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  useEffect(() => {
    const extractColor = async () => {
      if (petImage) {
        try {
          const colors = await getColors(petImage, {
            fallback: "#FFFFFF",
            cache: true,
            key: petImage,
          });

          if (colors.platform === "android") {
            setBackgroundColor(colors.dominant || "#FFFFFF");
          } else if (colors.platform === "ios") {
            setBackgroundColor(colors.background || "#FFFFFF");
          }
        } catch (error) {
          console.error("Error extracting colors:", error);
          setBackgroundColor("#FFFFFF");
        }
      }
    };
    extractColor();

    if (modalVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [petImage, modalVisible]);

  useEffect(() => {
    const luminance = getLuminance(backgroundColor);
    // Si la luminosidad es mayor que 0.5, es claro, de lo contrario es oscuro
    if (luminance > 0.5) {
      setTextColor("#000000"); // Texto negro
    } else {
      setTextColor("#FFFFFF"); // Texto blanco
    }
  }, [backgroundColor]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );
  return (
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onDismiss={() => setModalVisible(false)}
      >
        <BottomSheetView style={styles.modalContent}>
          {/* <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Opciones</Text>
        </View> */}

          <View style={[styles.postContent, { backgroundColor }]}>
            <View style={{ flexDirection: "row", gap: 15 }}>
              <Image style={styles.image} source={{ uri: petImage }} />
              <View style={{ justifyContent: "space-around" }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Image
                    style={styles.image2}
                    source={
                      ownerImage
                        ? { uri: ownerImage }
                        : require("@/assets/images/defaultProfile.jpg")
                    }
                  />
                  <Text style={[styles.text, {color: textColor}]}>{ownerName}</Text>
                </View>
                <Text style={[styles.text, {color: textColor}]}>{description}</Text>
              </View>
            </View>
          </View>

          <View style={styles.options}>
            <TouchableOpacity style={styles.optionsContent}>
              <Feather name="download" size={24} color="black" />
              <Text style={styles.textOptions}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsContent}>
              <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsContent}>
              <Entypo name="link" size={24} color="black" />
            </TouchableOpacity>
            {userId === ownerId && (
              <TouchableOpacity
                style={[styles.optionsContent, { backgroundColor: "#F44336" }]}
                onPress={() => setConfirmDeleteVisible(true)}
              >
                <Feather name="trash" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <Modal
        visible={confirmDeleteVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>
              ¿Estás seguro de que deseas borrar este post?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                onPress={() => setConfirmDeleteVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deletePost(petId, imageUrl)}
                style={styles.confirmButton}
              >
                <Text style={styles.buttonText}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postContent: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
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
  },
  text: {
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  confirmModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#CCCCCC",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
