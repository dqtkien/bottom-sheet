import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
} from "react-native";

interface UseBottomSheetProps {
  visible: boolean;
  contentHeight: number;
  onClose: () => void;
  animateOnMount?: boolean;
}

export const useBottomSheet = ({
  visible,
  contentHeight,
  onClose,
  animateOnMount = true,
}: UseBottomSheetProps) => {
  // Track whether this is the initial mount to handle "visible=true from the start"
  const isInitialMount = useRef(true);

  // If visible is true on initial mount and animateOnMount is false,
  // start in the open position directly (no animation).
  const initialTranslateY = visible && !animateOnMount ? 0 : contentHeight;
  const initialOpacity = visible && !animateOnMount ? 1 : 0;

  const [showModal, setShowModal] = useState(visible);
  const translateY = useRef(new Animated.Value(initialTranslateY)).current;
  const opacity = useRef(new Animated.Value(initialOpacity)).current;

  // Store latest refs to avoid re-creating PanResponder
  const latestRef = useRef({ contentHeight, onClose });

  useEffect(() => {
    latestRef.current = { contentHeight, onClose };
  }, [contentHeight, onClose]);

  const animateOpen = useCallback(
    (duration: number = 200) => {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [translateY, opacity],
  );

  const animateClose = useCallback(
    (duration: number = 200) => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: contentHeight,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    },
    [translateY, opacity, contentHeight],
  );

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
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (visible && animateOnMount) {
        requestAnimationFrame(() => animateOpen(250));
      }
      return;
    }

    // Subsequent visibility changes
    if (visible) {
      // Reset animated values to off-screen before opening
      translateY.setValue(contentHeight);
      opacity.setValue(0);
      setShowModal(true);
      requestAnimationFrame(() => animateOpen());
    } else {
      animateClose();
    }
  }, [visible]);

  // Handle contentHeight changes while visible (e.g. orientation change)
  useEffect(() => {
    if (!isInitialMount.current && !visible) {
      translateY.setValue(contentHeight);
    }
  }, [contentHeight]);

  return {
    showModal,
    translateY,
    opacity,
    panResponder,
    animateOpen,
    animateClose,
  };
};
