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

export function getPendingRequests(userId: number) {
  return instance.get(`/adoption-requests/pending/${userId}`);
}

export function setPetToAdopted(id: number, newOwnerId: number) {
  return instance.patch(`/pets/setPetToAdopted/${id}`, { newOwnerId });
}
