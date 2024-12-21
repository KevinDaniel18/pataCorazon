import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

const TestingScreen = () => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    return index;
  }, []);

  // renders
  return (
    <View style={styles.container}>
      
        <Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        />
        <BottomSheetModal
          index={1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text>aqui va el contenido</Text>
          </BottomSheetView>
        </BottomSheetModal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default TestingScreen;
