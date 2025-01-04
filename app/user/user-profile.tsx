import { View, StyleSheet, Text} from "react-native";

import { ProfileModalProps } from "@/types/profileModalTypes";
import ProfileModal from "@/components/ProfileModal";

export default function UserProfile({
  showProfile,
  toggleProfile,
}: ProfileModalProps) {
  return (
    <View>
      <ProfileModal showProfile={showProfile} toggleProfile={toggleProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
 
});
