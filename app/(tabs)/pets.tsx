import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import AdoptionRequest from "../../components/adoption/AdoptionRequest";
import { useUser } from "@/hooks/user/UserContex";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ModalPost from "@/components/ModalPost";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  BounceIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Pet {
  id: number;
  imageUrl: string;
  name: string;
  age: number;
  breed: string;
}

const { width } = Dimensions.get("window");

export default function PetsScreen() {
  const { userData, fetchUser } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<{ uri: string }[]>([]);
  const [modalPostVisible, setModalPostVisible] = useState(false);
  const [modalAdoptionRequest, setModalAdoptionRequest] = useState(false);
  const translateX = useSharedValue(width);

  const insets = useSafeAreaInsets();

  const openModal = () => {
    setModalAdoptionRequest(true);
    translateX.value = withTiming(0, { duration: 300 });
  };

  const closeModal = () => {
    translateX.value = withTiming(width, { duration: 300 }, () => {
      runOnJS(setModalAdoptionRequest)(false);
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      fetchUser();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      onRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [onRefresh]);

  useEffect(() => {
    if (userData?.pets) {
      setImageUrls(userData.pets.map((pet: Pet) => ({ uri: pet.imageUrl })));
    }
  }, [userData]);

  const handleImagePress = (index: number) => {
    setCurrentImageIndex(index);
    setIsVisible(true);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: insets.top,
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Text style={styles.sectionTitle}>Mis Mascotas</Text>
        <TouchableOpacity onPress={openModal}>
          <Ionicons name="notifications" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TouchableOpacity
          style={styles.bottomPost}
          onPress={() => setModalPostVisible(true)}
        >
          <View
            style={{ padding: 8, backgroundColor: "#8EDCBF", borderRadius: 20 }}
          >
            <MaterialIcons name="post-add" size={30} color="black" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Nueva adopción
          </Text>
        </TouchableOpacity>

        <Animated.View entering={BounceIn} style={styles.petList}>
          {userData?.pets.map((pet: Pet, index: number) => (
            <TouchableOpacity
              key={pet.id}
              style={styles.petCard}
              onPress={() => handleImagePress(index)}
            >
              <Image style={styles.petImage} source={{ uri: pet.imageUrl }} />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petDetails}>
                  {pet.age} años • {pet.breed}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
        
        <ImageViewing
          images={imageUrls}
          imageIndex={currentImageIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
          FooterComponent={({ imageIndex }) => (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {userData?.pets[imageIndex].name}
              </Text>
            </View>
          )}
        />

        <ModalPost
          modalVisible={modalPostVisible}
          setModalVisible={setModalPostVisible}
        />
      </ScrollView>

      <Modal transparent visible={modalAdoptionRequest} animationType="none" statusBarTranslucent>
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, animatedStyle]}>
            <View style={[styles.modalHeader, {marginTop: insets.top}]}>
              <Text style={styles.modalTitle}>Notificaciones</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <AdoptionRequest />
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#AEEFFF",
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "times",
  },
  bottomPost: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  petList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 100
  },
  petCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: "48%", // Ajusta para dos columnas
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  petImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
  },

  petInfo: {
    alignItems: "center",
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 14,
    color: "#666",
  },
  adoptionRequestsContainer: {
    marginTop: 24,
  },
  footer: {
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
  },
  footerText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    right: 0,
    width: width,
    height: "100%",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
