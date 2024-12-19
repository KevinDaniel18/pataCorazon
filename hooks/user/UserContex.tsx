import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserById } from "@/api/endpoint";
import * as SecureStore from "expo-secure-store";
import { LayoutAnimation } from "react-native";

interface Pet {
  id: number;
  name: string;
  breed: string;
  size: string;
  age: number;
  isAdopted: boolean;
  description: string;
  imageUrl: string;
  location: string;
  ownerId: number;
}

interface UserData {
  name: string;
  email: string
  city: string;
  country: string;
  profilePicture: string;
  pets: Pet[];
}

interface UserContextType {
  userData: UserData | null;
  profilePicture: string;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  setProfilePicture: React.Dispatch<React.SetStateAction<string>>;
  fetchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProvider {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProvider> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>("");

  const fetchUser = async () => {
    try {
      const userId = await SecureStore.getItemAsync("USER_ID");
      if (!userId) return;
      const parseId = Number(userId);

      const user = await getUserById(parseId);

      setUserData({
        name: user.data.name,
        email: user.data.email,
        city: user.data.city,
        country: user.data.country,
        profilePicture: user.data.profilePicture,
        pets: user.data.pets || [],
      });
      setProfilePicture(user.data.profilePicture);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        profilePicture,
        setUserData,
        setProfilePicture,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
