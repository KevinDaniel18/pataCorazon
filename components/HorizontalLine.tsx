import { StyleSheet, View } from "react-native";
import React from "react";

export default function HorizontalLine() {
  return (
    <View
      style={{
        borderBottomColor: "gray",
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 20
      }}
    />
  );
}
