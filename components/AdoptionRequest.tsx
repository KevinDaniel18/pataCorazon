import { getPendingRequests, setPetToAdopted } from "@/api/endpoint";
import { useSocket } from "@/hooks/socket/SocketContext";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface AdoptionRequest {
  id: number;
  description: string;
  pet: {
    id: number;
    name: string;
    breed: string;
    size: string;
    age: number;
  };
  user: {
    id: number;
    name: string;
  };
}

export default function AdoptionRequest() {
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>(
    []
  );
  const [adoptionRequest, setAdoptionRequest] = useState<any>(null);
  const socket = useSocket();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const userId = await SecureStore.getItemAsync("USER_ID");
        const response = await getPendingRequests(Number(userId));
        setAdoptionRequests(response.data);
      } catch (error) {
        console.error("Error al obtener solicitudes de adopción:", error);
      }
    };

    fetchPendingRequests();

    if (socket) {
      socket.on("newAdoptionRequest", (data) => {
        setAdoptionRequest(data);
      });

      return () => {
        socket.off("newAdoptionRequest");
      };
    }
  }, [socket]);

  const handleRequestDecision = async (
    requestId: number,
    accepted: boolean
  ) => {
    if (socket) {
      socket.emit(
        "acceptAdoptionRequest",
        { requestId, accepted },
        async (response: any) => {
          if (accepted) {
            try {
              const adoptionRequest = adoptionRequests.find(
                (request) => request.id === requestId
              );
              if (adoptionRequest) {
                const petId = adoptionRequest.pet.id;
                const newOwnerId = adoptionRequest.user.id;
                await setPetToAdopted(petId, newOwnerId);
              }
            } catch (error) {
              console.error("Error al marcar la mascota como adoptada:", error);
            }
          }
          setAdoptionRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== requestId)
          );
        }
      );
    }
  };

  if (!adoptionRequests.length && !adoptionRequest) {
    return (
      <Text style={styles.noRequestsText}>
        No hay nuevas solicitudes de adopción.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {adoptionRequest && (
        <View style={styles.requestsList}>
          <View style={styles.requestContainer}>
            <Text style={styles.title}>Nueva Solicitud de Adopción</Text>
            <Text style={styles.requesterText}>
              Solicitante: {adoptionRequest.requester.name}
            </Text>
            <Text style={styles.petInfoText}>
              Nombre de la mascota: {adoptionRequest.pet.name}
            </Text>
            <Text style={styles.petInfoText}>
              Raza: {adoptionRequest.pet.breed}
            </Text>
            <Text style={styles.petInfoText}>
              Edad: {adoptionRequest.pet.age} años
            </Text>
            <Text style={styles.descriptionText}>
              {adoptionRequest.requestDetails.description}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={() =>
                  handleRequestDecision(adoptionRequest.requestDetails.id, true)
                }
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() =>
                  handleRequestDecision(
                    adoptionRequest.requestDetails.id,
                    false
                  )
                }
              >
                <Text style={styles.buttonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {adoptionRequests.length > 0 && (
        <View style={styles.requestsList}>
          {adoptionRequests.map((request) => (
            <View key={request.id} style={styles.requestContainer}>
              <Text style={styles.title}>Solicitud de Adopción</Text>
              <Text style={styles.requesterText}>
                Solicitante: {request.user.name}
              </Text>
              <Text style={styles.petInfoText}>
                Nombre de la mascota: {request.pet.name}
              </Text>
              <Text style={styles.petInfoText}>Raza: {request.pet.breed}</Text>
              <Text style={styles.petInfoText}>
                Edad: {request.pet.age} años
              </Text>
              <Text style={styles.descriptionText}>{request.description}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => handleRequestDecision(request.id, true)}
                >
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleRequestDecision(request.id, false)}
                >
                  <Text style={styles.buttonText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  noRequestsText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  requestContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  requesterText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  petInfoText: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  requestsList: {
    marginTop: 24,
    marginBottom: 80,
  },
});
