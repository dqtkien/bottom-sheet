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
import { resolveSnapPoints } from "../../utils/snapPoint";
import { CloseIcon } from "../CloseIcon/CloseIcon";

/**
 * A highly configurable, performant React Native Bottom Sheet component.
 * Supports multiple snap points, smooth animations, and gesture-based interactions.
 *
 * @param props - {@link BottomSheetProps}
 */
export const BottomSheet = ({
  visible,
  onClose,
  children,
  snapPoints = ["33%"],
  initialSnapIndex = 0,
  onSnapChange,
  enableSwipeUp = true,
  enablePanDownToClose = true,
  animateOnMount = true,
  closeIcon,
  sheetStyle,
  handleIndicatorStyle,
  handleContainerStyle,
  backdropStyle,
  closeButtonStyle,
  contentStyle,
  hideCloseButton = false,
}: BottomSheetProps) => {
  const { height: windowHeight } = useWindowDimensions();

  // Resolve snap points to sorted ascending pixel values
  const snapHeights = useMemo(
    () => resolveSnapPoints(snapPoints, windowHeight),
    [snapPoints, windowHeight],
  );

  const { showModal, translateY, opacity, panResponder, maxSnapHeight } =
    useBottomSheet({
      visible,
      snapHeights,
      onClose,
      animateOnMount,
      initialSnapIndex,
      onSnapChange,
      enableSwipeUp,
      enablePanDownToClose,
    });

  const animatedSheetStyle = useMemo(
    () => [
      styles.sheetContainer,
      sheetStyle,
      { height: maxSnapHeight, transform: [{ translateY }] },
    ],
    [sheetStyle, maxSnapHeight, translateY],
  );

  if (!showModal) return null;

  return (
    <View style={styles.modalWrapper} pointerEvents="box-none">
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.backdropContainer, { opacity }]}
          {...panResponder.panHandlers}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={[styles.backdrop, backdropStyle]} />
          </TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View style={animatedSheetStyle}>
          <View
            style={[styles.handleContainer, handleContainerStyle]}
            {...panResponder.panHandlers}
          >
            <View style={[styles.handle, handleIndicatorStyle]} />
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
    shadowColor: "#2d2f44",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: "transparent",
    width: "100%",
  },
  handle: {
    width: 60,
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
