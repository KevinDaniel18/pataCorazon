import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/socket/SocketContext";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { getMessages } from "@/api/endpoint";

export default function ModalChat({
  receiverId,
  visible,
  onClose,
  userName,
}: any) {
  const [sendMessage, setSendMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(visible);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const slideAnim = useRef(new Animated.Value(500)).current;
  const socket = useSocket();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function loadMessages() {
      try {
        const msgData = await getMessages(Number(receiverId));

        setMessages(msgData.data);
      } catch (error) {
        console.error(error);
      }
    }
    loadMessages();
  }, [receiverId]);

  useEffect(() => {
    const joinUserRoom = async () => {
      const userId = Number(await SecureStore.getItemAsync("USER_ID"));
      setUserId(userId);
      if (socket && userId) {
        socket.emit("joinRoom", userId);
      }
    };

    const handleNewMessage = (msg: string) => {
      setMessages((prevMsg) => [...prevMsg, msg]);
    };

    if (socket) {
      socket.on("receiveMessage", handleNewMessage);
    }

    if (visible) {
      setModalVisible(true);
      joinUserRoom();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage", handleNewMessage);
      }
    };
  }, [visible]);

  const handleSendMessage = async () => {
    if (socket && sendMessage.trim() !== "") {
      const newMessage = {
        senderId: Number(await SecureStore.getItemAsync("USER_ID")),
        receiverId: Number(receiverId),
        content: sendMessage,
        createdAt: new Date().toISOString(),
      };

      // Emitir el mensaje al servidor
      socket.emit("sendMessage", newMessage);

      // Agregar el mensaje al estado local
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Limpiar el campo de entrada
      setSendMessage("");
    }
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groupedMessages: any = {};
    messages.forEach((message) => {
      if (!message.createdAt) return;
      const messageDate = parseISO(message.createdAt);
      const isToday = formatDistanceToNow(messageDate, {
        addSuffix: true,
      }).includes("ago");
      const isYesterday = formatDistanceToNow(messageDate, {
        addSuffix: true,
      }).includes("yesterday");

      let groupLabel = "";

      if (isToday) {
        groupLabel = "Hoy";
      } else if (isYesterday) {
        groupLabel = "Ayer";
      } else {
        groupLabel = format(messageDate, "d MMMM yyyy", { locale: es });
      }

      if (!groupedMessages[groupLabel]) {
        groupedMessages[groupLabel] = [];
      }
      groupedMessages[groupLabel].push(message);
    });
    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.chatOverlay,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={[styles.header, { marginTop: insets.top }]}>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="arrowleft" size={28} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{userName}</Text>
          </View>

          <View style={styles.content}>
            <FlatList
              data={Object.keys(groupedMessages)}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View>
                  <Text style={styles.dateLabel}>{item}</Text>
                  {groupedMessages[item].map(
                    (
                      message: {
                        senderId: number;
                        content: string;
                      },
                      index: React.Key | null | undefined
                    ) => (
                      <View
                        key={index}
                        style={[
                          styles.messageBubble,
                          message.senderId === Number(userId)
                            ? styles.sentMessage
                            : styles.receivedMessage,
                        ]}
                      >
                        <Text style={styles.messageText}>
                          {message.content}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}
            />
          </View>

          <View
            style={[styles.chatInputContainer, { marginBottom: insets.bottom }]}
          >
            <TextInput
              value={sendMessage}
              onChangeText={setSendMessage}
              placeholder="Escribe un mensaje..."
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <AntDesign name="arrowup" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatOverlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    elevation: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "75%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E8E8E8",
  },
  messageText: {
    fontSize: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 5,
    color: "#888",
  },
});
