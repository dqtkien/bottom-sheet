import React, { useMemo } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { useBottomSheet } from "../../hooks/useBottomSheet";
import { BottomSheetProps } from "../../types";
import { CloseIcon } from "../CloseIcon/CloseIcon";

export const BottomSheet = ({
  visible,
  onClose,
  children,
  snapPoints = ["33%"],
  animateOnMount = true,
  closeIcon,
  sheetStyle,
  handleStyle,
  backdropStyle,
  closeButtonStyle,
  contentStyle,
  hideCloseButton = false,
}: BottomSheetProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const heightPercentage = parseFloat(snapPoints[0]) || 33;
  const contentHeight = (windowHeight * heightPercentage) / 100;

  const { showModal, translateY, opacity, panResponder } = useBottomSheet({
    visible,
    contentHeight,
    onClose,
    animateOnMount,
  });

  const animatedSheetStyle = useMemo(
    () => [
      styles.sheetContainer,
      sheetStyle,
      { height: contentHeight, transform: [{ translateY }] },
    ],
    [sheetStyle, contentHeight, translateY],
  );

  if (!showModal) return null;

  return (
    <View style={styles.modalWrapper} pointerEvents="box-none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdropContainer, { opacity }]}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={[styles.backdrop, backdropStyle]} />
          </TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View style={animatedSheetStyle}>
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View style={[styles.handle, handleStyle]} />
          </View>
          {!hideCloseButton && (
            <Pressable
              onPress={onClose}
              style={[styles.closeBtn, closeButtonStyle]}
            >
              {closeIcon ? closeIcon : <CloseIcon />}
            </Pressable>
          )}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    zIndex: 999999,
    elevation: 999999,
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheetContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 8,
    shadowColor: "#2d2f44",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 4,
    marginBottom: 8,
    backgroundColor: "transparent",
    width: "100%",
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#e1e1e1",
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1e1e180",
    borderRadius: 16,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
  },
});
