import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  PanResponder,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: string[]; // E.g. ['33%']

  // Customization Props
  closeIcon?: ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  closeButtonStyle?: StyleProp<ViewStyle>;
  hideCloseButton?: boolean;
};

// Fallback close icon built using basic View primitives
const FallbackCloseIcon = () => (
  <View style={styles.closeIconWrapper}>
    <View
      style={[styles.closeIconStroke, { transform: [{ rotate: "45deg" }] }]}
    />
    <View
      style={[styles.closeIconStroke, { transform: [{ rotate: "-45deg" }] }]}
    />
  </View>
);

const BottomSheet = ({
  visible,
  onClose,
  children,
  snapPoints = ["33%"],
  closeIcon,
  sheetStyle,
  handleStyle,
  backdropStyle,
  closeButtonStyle,
  hideCloseButton = false,
}: BottomSheetProps) => {
  const windowHeight = Dimensions.get("window").height;
  const heightPercentage = parseFloat(snapPoints[0]) || 33;
  const contentHeight = (windowHeight * heightPercentage) / 100;

  const [showModal, setShowModal] = useState(visible);
  const translateY = useRef(new Animated.Value(contentHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        if (gestureState.dy > contentHeight / 4 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
            bounciness: 0,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: contentHeight,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible, contentHeight, translateY, opacity]);

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdropContainer, { opacity }]}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={[styles.backdrop, backdropStyle]} />
          </TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View
          style={[
            styles.sheetContainer,
            sheetStyle,
            { height: contentHeight, transform: [{ translateY }] },
          ]}
        >
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View style={[styles.handle, handleStyle]} />
          </View>
          {!hideCloseButton && (
            <Pressable
              onPress={onClose}
              style={[styles.closeBtn, closeButtonStyle]}
            >
              {closeIcon ? closeIcon : <FallbackCloseIcon />}
            </Pressable>
          )}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    paddingBottom: 24,
  },
});

export default BottomSheet;
