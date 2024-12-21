import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import AdoptionRequest from "@/components/AdoptionRequest";
import { useUser } from "@/hooks/user/UserContex";

interface Pet {
  id: number;
  imageUrl: string;
  name: string;
  age: number;
  breed: string;
}

export default function PetsScreen() {
  const { userData, fetchUser } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<{ uri: string }[]>([]);

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
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Mis Mascotas</Text>
        <View style={styles.petList}>
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
        </View>

        <View style={styles.adoptionRequestsContainer}>
          <AdoptionRequest />
        </View>

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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AEEFFF",
  },
  sectionTitle: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 16,
  },
  petList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
});
