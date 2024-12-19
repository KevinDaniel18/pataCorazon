import { getPets } from "@/api/endpoint";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AdoptionForm from "./AdoptionForm";
import * as SecureStore from "expo-secure-store";
import PetPostsOptions from "./PetPostsOptions";

interface BadgeProps {
  text: string;
  color: string;
}

interface PostData {
  id: number;
  name: string;
  breed: string;
  age: number;
  isVaccinated: boolean;
  isSterilized: boolean;
  description: string;
  size: string;
  isAdopted: boolean;
  imageUrl: string;
  location: string;
  createdAt: string;
  owner: {
    id: number;
    name: string;
    profilePicture: string;
  };
}

export const Badge: React.FC<BadgeProps> = ({ text, color }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{text}</Text>
  </View>
);

const { width } = Dimensions.get("window");

export default function PetPosts() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPostOptions, setModalPostOptions] = useState(false);

  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function getUserID() {
      const userId = await SecureStore.getItemAsync("USER_ID");
      setUserId(Number(userId));
    }
    getUserID();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setRefreshing(true);
    try {
      const res = await getPets();

      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
    setRefreshing(false);
  }

  const openModal = (petId: number) => {
    console.log("petId al abrir modal:", petId);
    if (petId != null) {
      setSelectedPetId(petId);
      setModalVisible(true);
    } else {
      console.error("petId no válido");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPetId(null);
  };

  const renderPost = ({ item }: { item: PostData }) => {
    const scaleAnim = new Animated.Value(0.95);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const calculateElapsedTime = (createdAt: string) => {
      const createdDate = new Date(createdAt);
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - createdDate.getTime()) / 1000
      );

      if (diffInSeconds < 60) return `${diffInSeconds} segundos atrás`;
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
      return `${Math.floor(diffInSeconds / 86400)} días atrás`;
    };

    const elapsedTime = calculateElapsedTime(item.createdAt);

    return (
      <Animated.View
        style={[styles.postContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.userDetails}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={
                item.owner.profilePicture
                  ? { uri: item.owner.profilePicture }
                  : require("@/assets/images/defaultProfile.jpg")
              }
              style={styles.userImage}
            />
            <View>
              <Text style={styles.userName}>{item.owner.name}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => setModalPostOptions(true)}>
            <SimpleLineIcons name="options-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Image style={styles.imagePost} source={{ uri: item.imageUrl }} />

        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.petName}>{item.name}</Text>
            <Badge
              text={item.isAdopted ? "Adoptado" : "Disponible"}
              color={item.isAdopted ? "#4CAF50" : "#F44336"}
            />
          </View>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Raza:</Text> {item.breed}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Edad:</Text> {item.age} años
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Tamaño:</Text> {item.size}
          </Text>
          <View style={styles.badgeContainer}>
            <Badge
              text={item.isVaccinated ? "Vacunado" : "No vacunado"}
              color={item.isVaccinated ? "#4CAF50" : "#F44336"}
            />
            <Badge
              text={item.isSterilized ? "Esterilizado" : "No esterilizado"}
              color={item.isSterilized ? "#4CAF50" : "#F44336"}
            />
          </View>
        </View>

        {item.description && (
          <Text style={styles.caption}>{item.description}</Text>
        )}

        <View style={styles.postActions}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
          {userId !== item.owner.id && (
            <TouchableOpacity onPress={() => openModal(item.id)}>
              <MaterialIcons name="pets" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.elapsedTime}>{elapsedTime}</Text>

        <PetPostsOptions
          modalVisible={modalPostOptions}
          setModalVisible={setModalPostOptions}
          petImage={item.imageUrl}
          ownerImage={item.owner.profilePicture}
          ownerName={item.owner.name}
          description={item.description}
        />
      </Animated.View>
    );
  };

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        refreshing={refreshing}
        onRefresh={fetchPosts}
        ListFooterComponent={<View style={{ height: 200 }} />}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          {selectedPetId && (
            <AdoptionForm petId={selectedPetId} onClose={closeModal} />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  postContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#E8F6EF",
    justifyContent: "space-between",
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  location: {
    fontSize: 12,
    color: "#555",
  },
  imagePost: {
    width: width - 20,
    height: width - 20,
    resizeMode: "cover",
  },
  adoptionStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: 10,
  },
  adopted: {
    backgroundColor: "#4CAF50", // Verde para adoptado
  },
  notAdopted: {
    backgroundColor: "#F44336", // Rojo para no adoptado
  },
  adoptionText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  petName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    gap: 10,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: "#F3F4F6",
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  caption: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontSize: 14,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#4CAF50",
  },
  elapsedTime: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
