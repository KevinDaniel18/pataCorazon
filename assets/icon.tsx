import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

export type RouteName = "index" | "pets" | "profile" | "testing_screen";

export const icons: Record<RouteName, (props: any) => JSX.Element> = {
  index: (props: any) => <Foundation name="home" size={24} {...props} />,
  pets: (props: any) => <MaterialIcons name="pets" size={24} {...props} />,
  profile: (props: any) => <FontAwesome name="user" size={24} {...props} />,
  testing_screen: (props: any) => <Feather name="code" size={24} {...props} />,
};
