import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Animated,
  PanResponder,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import CommentsPostForm from "./CommentsPostForm";
import {
  getCommentsByPet,
  hasUserLiked,
  likeComment,
  unlikeComment,
} from "@/api/endpoint";
import { Comment, CommentsProps, Pets } from "@/types/comments";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import UserProfile from "@/app/user/user-profile";
import { useRouter } from "expo-router";

export default function Comments({
  modalVisible,
  setModalVisible,
  petId,
}: CommentsProps) {
  const [data, setData] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const translateY = useState(new Animated.Value(700))[0];
  const backdropOpacity = useState(new Animated.Value(0))[0];
  const route = useRouter();

  async function toggleProfileModal(
    userName: string,
    userImage: string,
    userId: number,
    city: string,
    country: string,
    pet: Pets[]
  ) {
    setShowProfile(true);
    route.setParams({ userName, userImage, userId, city, country, pet: JSON.stringify(pet) });
  }

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await getCommentsByPet(petId);
      console.log(JSON.stringify(res.data));
      
      setData(res.data.reverse());
      setCommentCount(res.data.length);

      const likedIds = await Promise.all(
        res.data.map(async (comment: { id: any }) => {
          const liked = await hasUserLiked(comment.id);
          return liked ? comment.id : null;
        })
      );
      setLikedComments(likedIds.filter((id) => id !== null));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const panResponder = useCallback(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 20) {
            Animated.parallel([
              Animated.spring(translateY, {
                toValue: 700,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
              }),
              Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start(() => setModalVisible(false));
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 30,
              friction: 7,
            }).start();
          }
        },
      }),
    [translateY, backdropOpacity, setModalVisible]
  );

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      fetchComments();
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 500,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, translateY, backdropOpacity]);

  const handleNewComment = (newComment: Comment) => {
    setData((prevData) => [newComment, ...prevData]);
    setCommentCount((prevCount) => prevCount + 1);
  };

  const onLikeComment = async (id: number) => {
    await likeComment(id);
  };

  const onUnlikeComment = async (id: number) => {
    await unlikeComment(id);
  };

  const toggleLike = async (id: number) => {
    const updatedData = data.map((comment) => {
      if (comment.id === id) {
        const isCurrentlyLiked = likedComments.includes(id);
        const updatedLikes = isCurrentlyLiked
          ? comment.likes - 1
          : comment.likes + 1;

        return { ...comment, likes: updatedLikes };
      }
      return comment;
    });

    setData(updatedData);

    if (likedComments.includes(id)) {
      await onUnlikeComment(id);
      setLikedComments((prev) => prev.filter((commentId) => commentId !== id));
    } else {
      await onLikeComment(id);
      setLikedComments((prev) => [...prev, id]);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => {
      const isLiked = likedComments.includes(item.id);

      return (
        <View style={styles.commentItem}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                toggleProfileModal(
                  item.user.name,
                  item.user.profilePicture,
                  item.user.id,
                  item.user.city,
                  item.user.country,
                  item.user.pets
                )
              }
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Image
                style={styles.userPicture}
                source={
                  item.user.profilePicture
                    ? { uri: item.user.profilePicture }
                    : require("@/assets/images/defaultProfile.jpg")
                }
              />
              <Text style={styles.userName}>
                {item.user ? item.user.name : "Usuario desconocido"}
              </Text>
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                <AntDesign
                  name={isLiked ? "heart" : "hearto"}
                  size={14}
                  color="black"
                />
              </TouchableOpacity>
              <Text>{item.likes >= 1 ? item.likes : null}</Text>
            </View>
          </View>
          <Text style={styles.commentContent}>{item.content}</Text>
          <Text style={styles.commentDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      );
    },
    [likedComments]
  );

  const keyExtractor = useCallback((item: Comment) => item.id.toString(), []);

  const panHandlers = useCallback(panResponder, [panResponder])().panHandlers;

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={() => setModalVisible(false)}
      statusBarTranslucent
    >
      <Animated.View
        style={[styles.modalBackdrop, { opacity: backdropOpacity }]}
      >
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: translateY }] },
          ]}
        >
          <Animated.View {...panHandlers} style={styles.grip}>
            <View style={styles.gripIcon}>
              <FontAwesome6 name="grip-lines" size={24} color="black" />
            </View>
            <Text style={styles.text}>
              {" "}
              Comentarios {commentCount > 0 ? `(${commentCount})` : ""}
            </Text>
          </Animated.View>

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : null
            }
            contentContainerStyle={styles.contentContainer}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />

          <CommentsPostForm petId={petId} onCommentPosted={handleNewComment} />
        </Animated.View>
      </Animated.View>
      <UserProfile showProfile={showProfile} toggleProfile={toggleProfile} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
    width: "100%",
    maxHeight: "80%",
  },
  grip: {
    justifyContent: "center",
    paddingVertical: 8,
  },
  gripIcon: {
    alignSelf: "center",
    marginBottom: 4,
  },
  text: {
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    fontSize: 15,
    paddingBottom: 10,
  },
  commentItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  userPicture: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentContent: {
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
  },
  contentContainer: {
    padding: 10,
  },
});
