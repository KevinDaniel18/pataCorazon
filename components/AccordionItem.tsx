import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";

function AccordionItem({
  title,
  children,
  headerIcon,
  headerRightContent,
  style,
  duration = 300,
}: any) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isExpanded = useSharedValue(false);
  const height = useSharedValue(0);

  const toggleAccordion = () => {
    isExpanded.value = !isExpanded.value;
    setIsOpen(!isOpen);
  };

  const bodyStyle = useAnimatedStyle(() => ({
    height: withTiming(isExpanded.value ? height.value : 0, {
      duration,
      easing: Easing.out(Easing.cubic),
    }),
  }));

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.header} onPress={toggleAccordion}>
        <View style={styles.headerLeft}>
          {headerIcon}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          {headerRightContent}
          <AntDesign name={isOpen ? "up" : "down"} size={20} color="black" />
        </View>
      </TouchableOpacity>

      <Animated.View style={[styles.content, bodyStyle]}>
        {isOpen && (
          <View
            onLayout={(e) => {
              height.value = e.nativeEvent.layout.height;
            }}
            style={styles.innerContent}
          >
            {children}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    overflow: "hidden",
  },
  innerContent: {
    position: "absolute",
    width: "100%",
  },
});

export default AccordionItem;
