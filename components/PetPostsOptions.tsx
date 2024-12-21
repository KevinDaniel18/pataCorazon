import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { getColors } from "react-native-image-colors";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

export default function PetPostsOptions({
  modalVisible,
  setModalVisible,
  petImage,
  ownerImage,
  ownerName,
  description,
}: any) {
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
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
            <View style={{justifyContent: "space-around"}}>
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
          <TouchableOpacity
            style={[styles.optionsContent, { backgroundColor: "#F44336" }]}
          >
            <Feather name="trash" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
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
    color: "#fff"
  },
});
