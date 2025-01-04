import axios from "axios";
import * as SecureStore from "expo-secure-store";

const instance = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

const getAuthToken = async () => {
  const token = await SecureStore.getItemAsync("TOKEN_KEY");
  return token ? `Bearer ${token}` : "";
};

instance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function register(userData: {
  email: string;
  name: string;
  password: string;
  city: string;
  country: string;
}) {
  return instance.post("/auth/register", userData);
}

export function login(loginData: { email: string; password: string }) {
  return instance.post("/auth/login", loginData);
}

export function updateProfilePicture(id: number, url: string) {
  return instance.patch(`/user/${id}/profile-picture`, {
    profilePicture: url,
  });
}

export function getUserById(id: number) {
  return instance.get(`/user/${id}`);
}

export function updateUser(userData: {
  name?: string | undefined;
  email?: string | undefined;
  city?: string | undefined;
  country?: string | undefined;
  password?: string | undefined;
}) {
  return instance.patch("/user/updateUser", userData);
}

export function removeProfilePicture() {
  return instance.patch("/user/remove-profile-picture");
}

export function registerPet(petData: {
  name: string;
  breed: string;
  age: number;
  isVaccinated: boolean;
  isSterilized: boolean;
  description: string;
  size: string;
  imageUrl: string;
  location: string;
  ownerId?: number;
}) {
  return instance.post("/pets/register", petData);
}

export function getPets() {
  return instance.get("/pets");
}

export function updateNotificationToken(notificationData: {
  expoPushToken: string;
}) {
  return instance.patch(
    "/notifications/updateNotificationToken",
    notificationData
  );
}

export function disableNotifications() {
  return instance.patch("/notifications/disableNotifications");
}

export function getPendingRequests(userId: number) {
  return instance.get(`/adoption-requests/pending/${userId}`);
}

export function setPetToAdopted(id: number, newOwnerId: number) {
  return instance.patch(`/pets/setPetToAdopted/${id}`, { newOwnerId });
}

export function deletePetPosted(petId: number) {
  return instance.delete(`/pets/deleteAdoptionPost/${petId}`);
}

export function addPetComment(data: {
  content: string;
  petId: number | undefined;
}) {
  return instance.post("/comments/create", data);
}

export function getCommentsByPet(petId: number) {
  return instance.get(`/comments/${petId}`);
}

export function likeComment(id: number) {
  return instance.post(`/comments/${id}/like`);
}
export function unlikeComment(id: number) {
  return instance.post(`/comments/${id}/unlike`);
}

export async function hasUserLiked(id: number) {
  const res = await  instance.get(`/comments/${id}/liked`);
  return res.data
}
