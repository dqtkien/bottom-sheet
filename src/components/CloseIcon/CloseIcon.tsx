import React from "react";
import { StyleSheet, View } from "react-native";
import { ROTATE_45, ROTATE_NEG_45 } from "../../utils/constants";

export const CloseIcon = React.memo(() => (
  <View style={styles.closeIconWrapper}>
    <View style={[styles.closeIconStroke, ROTATE_45]} />
    <View style={[styles.closeIconStroke, ROTATE_NEG_45]} />
  </View>
));

const styles = StyleSheet.create({
  closeIconWrapper: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIconStroke: {
    position: "absolute",
    width: 2,
    height: 14,
    backgroundColor: "#656565",
    borderRadius: 1,
  },
});
