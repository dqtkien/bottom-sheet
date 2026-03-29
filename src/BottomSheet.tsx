import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  PanResponderGestureState,
  useWindowDimensions,
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
  contentStyle?: StyleProp<ViewStyle>;
  hideCloseButton?: boolean;
};

// Pre-computed rotation styles to avoid re-creation
const ROTATE_45: ViewStyle = { transform: [{ rotate: "45deg" }] };
const ROTATE_NEG_45: ViewStyle = { transform: [{ rotate: "-45deg" }] };

// Fallback close icon built using basic View primitives (memoized)
const FallbackCloseIcon = React.memo(() => (
  <View style={styles.closeIconWrapper}>
    <View style={[styles.closeIconStroke, ROTATE_45]} />
    <View style={[styles.closeIconStroke, ROTATE_NEG_45]} />
  </View>
));

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
  contentStyle,
  hideCloseButton = false,
}: BottomSheetProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const heightPercentage = parseFloat(snapPoints[0]) || 33;
  const contentHeight = (windowHeight * heightPercentage) / 100;

  const [showModal, setShowModal] = useState(visible);
  const translateY = useRef(new Animated.Value(contentHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const latestRef = useRef({ contentHeight, onClose });
  useEffect(() => {
    latestRef.current = { contentHeight, onClose };
  }, [contentHeight, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // Only claim gesture if clearly swiping down
        return (
          gestureState.dy > 5 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onMoveShouldSetPanResponderCapture: () => false,
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
        const { contentHeight: h, onClose: close } = latestRef.current;
        if (gestureState.dy > h / 4 || gestureState.vy > 0.5) {
          close();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
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
          useNativeDriver: true,
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
          useNativeDriver: true,
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

  const animatedSheetStyle = useMemo(
    () => [
      styles.sheetContainer,
      sheetStyle,
      { height: contentHeight, transform: [{ translateY }] },
    ],
    [sheetStyle, contentHeight, translateY],
  );

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
        <Animated.View style={animatedSheetStyle}>
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
          <View style={[styles.content, contentStyle]}>{children}</View>
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
    paddingBottom: 16,
  },
});

export default BottomSheet;
