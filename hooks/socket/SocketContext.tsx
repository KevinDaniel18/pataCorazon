import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    async function initializeSocket() {
      const userId = await SecureStore.getItemAsync("USER_ID");
      const newSocket = io(process.env.EXPO_PUBLIC_API_URL, {
        query: { userId: Number(userId) },
      });

      newSocket.on("connect", () =>
        console.log("Socket connected:", newSocket.id)
      );
      newSocket.on("disconnect", () => console.log("Socket disconnected"));

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
    initializeSocket();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
