import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = ["Todos", "Reciente", "Tamaño", "Edad", "Ubicación"];

const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { marginTop: insets.top }]}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} accessibilityRole="tab">
            <Text style={styles.text}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
     
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: "space-between",
  },
  text: {
    fontWeight: "bold",
    fontSize: 15
  },
});
