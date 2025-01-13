import { View, SafeAreaView, StyleSheet } from "react-native";
import PetPosts from "@/components/pet/PetPosts";
import Header from "@/components/Header";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container]}>
        <Header />

        <PetPosts />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#AEEFFF",
    backgroundColor: "white",
    padding: 20,
  },
});
