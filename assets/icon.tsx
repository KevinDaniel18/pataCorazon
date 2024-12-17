import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type RouteName = "index" | "pets" | "profile";

export const icons: Record<RouteName, (props: any) => JSX.Element> = {
  index: (props: any) => <Foundation name="home" size={24} {...props} />,
  pets: (props: any) => <MaterialIcons name="pets" size={24} {...props} />,
  profile: (props: any) => <FontAwesome name="user" size={24} {...props} />,
};
