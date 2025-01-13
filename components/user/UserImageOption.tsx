import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";

export default function UserImageOption({
  modalVisible,
  setModalVisible,
  uploadAvatar,
  deleteAvatar,
  avatarUrl,
}: any) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["20%"], []);

  useEffect(() => {
    if (modalVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [modalVisible]);

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
      <BottomSheetView style={styles.container}>
        <View style={styles.content}>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => uploadAvatar()}
            >
              <FontAwesome name="image" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.text}>Seleccionar imagen</Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.button,
                !avatarUrl && { opacity: 0.5 },
              ]}
              onPress={() => deleteAvatar()}
              disabled={!avatarUrl}
            >
              <Feather name="trash" size={24} color="#F44336" />
            </TouchableOpacity>

            <Text style={styles.text}>Borrar imagen</Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 50,
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(218, 218, 218, 0.7)",
    padding: 10,
    borderRadius: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
});
