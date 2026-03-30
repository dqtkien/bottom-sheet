import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
} from "react-native";

export interface UseBottomSheetProps {
  visible: boolean;
  snapHeights: number[]; // Sorted ascending pixel heights
  onClose: () => void;
  animateOnMount?: boolean;
  initialSnapIndex?: number;
  onSnapChange?: (index: number) => void;
  enableSwipeUp?: boolean;
  enablePanDownToClose?: boolean;
}

/**
 * Multi-snap-point bottom sheet hook.
 *
 * The sheet container always has height = maxSnapHeight (the largest snap point).
 * We use translateY to control how much is visible:
 * - translateY = 0 → fully expanded (max snap point visible)
 * - translateY = maxH - snapH → partially visible at snapH
 * - translateY = maxH → fully hidden
 */
export const useBottomSheet = ({
  visible,
  snapHeights,
  onClose,
  animateOnMount = true,
  initialSnapIndex = 0,
  onSnapChange,
  enableSwipeUp = true,
  enablePanDownToClose = true,
}: UseBottomSheetProps) => {
  // The translateY value at the start of a gesture
  const gestureStartY = useRef(0);

  const maxSnapHeight =
    snapHeights.length > 0 ? snapHeights[snapHeights.length - 1] : 0;

  // Clamp initialSnapIndex to valid range
  const clampedInitialIndex = Math.min(
    Math.max(0, initialSnapIndex),
    snapHeights.length - 1,
  );

  // Track whether this is the initial mount
  const isInitialMount = useRef(true);

  // Current snap index ref (avoid re-creating PanResponder)
  const snapIndexRef = useRef(clampedInitialIndex);

  // Calculate translateY for a given snap index
  const getTranslateYForIndex = useCallback(
    (index: number): number => {
      if (snapHeights.length === 0) return 0;
      const snapHeight = snapHeights[index] ?? snapHeights[0];
      return maxSnapHeight - snapHeight;
    },
    [snapHeights, maxSnapHeight],
  );

  // Initial animated values
  const initialTranslateY =
    visible && !animateOnMount
      ? getTranslateYForIndex(clampedInitialIndex)
      : maxSnapHeight;
  const initialOpacity = visible && !animateOnMount ? 1 : 0;

  const [showModal, setShowModal] = useState(visible);
  const translateY = useRef(new Animated.Value(initialTranslateY)).current;
  const opacity = useRef(new Animated.Value(initialOpacity)).current;

  // Store latest refs for PanResponder access
  const latestRef = useRef({
    snapHeights,
    maxSnapHeight,
    onClose,
    onSnapChange,
    enableSwipeUp,
    enablePanDownToClose,
    getTranslateYForIndex,
  });

  // Animate to a specific snap index
  const animateToSnap = useCallback(
    (index: number, duration: number = 200) => {
      const targetY = getTranslateYForIndex(index);
      snapIndexRef.current = index;

      Animated.spring(translateY, {
        toValue: targetY,
        useNativeDriver: true,
        bounciness: 0,
        speed: 14,
      }).start();

      onSnapChange?.(index);
    },
    [translateY, getTranslateYForIndex, onSnapChange],
  );

  const animateOpen = useCallback(
    (duration: number = 200) => {
      setShowModal(true);
      const targetIndex = clampedInitialIndex;
      const targetY = getTranslateYForIndex(targetIndex);
      snapIndexRef.current = targetIndex;

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: targetY,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start();

      onSnapChange?.(targetIndex);
    },
    [
      translateY,
      opacity,
      clampedInitialIndex,
      getTranslateYForIndex,
      onSnapChange,
    ],
  );

  const animateClose = useCallback(
    (duration: number = 200) => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: maxSnapHeight,
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
    [translateY, opacity, maxSnapHeight],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const isVertical =
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        const isDraggingDown = gestureState.dy > 5;
        const isDraggingUp = gestureState.dy < -5;

        if (!isVertical) return false;

        // Allow down always, up only if enabled
        if (isDraggingDown) return true;
        if (isDraggingUp && latestRef.current.enableSwipeUp) return true;

        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: () => {
        // Record the current translateY position when gesture starts
        const currentIndex = snapIndexRef.current;
        gestureStartY.current =
          latestRef.current.getTranslateYForIndex(currentIndex);
      },

      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const { maxSnapHeight: maxH } = latestRef.current;
        // new position = starting position + drag delta
        const newY = gestureStartY.current + gestureState.dy;
        // Clamp: don't go above the max snap (translateY=0) or below hidden
        const clamped = Math.max(0, Math.min(newY, maxH));
        translateY.setValue(clamped);
      },

      onPanResponderRelease: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const {
          snapHeights: heights,
          maxSnapHeight: maxH,
          onClose: close,
          onSnapChange: onChange,
          enableSwipeUp: upEnabled,
        } = latestRef.current;

        const currentIndex = snapIndexRef.current;
        const dy = gestureState.dy;
        const vy = gestureState.vy;

        // Determine if this is a swipe up or down
        const isSwipingDown = dy > 0;
        const isSwipingUp = dy < 0;

        // Velocity threshold for a quick flick
        const VELOCITY_THRESHOLD = 0.5;
        // Distance threshold as a fraction of distance to next snap
        const DISTANCE_FRACTION = 0.25;

        let targetIndex = currentIndex;

        if (isSwipingDown) {
          if (currentIndex === 0) {
            // At the lowest snap — check if we should close
            if (latestRef.current.enablePanDownToClose) {
              const currentSnapH = heights[0];
              const shouldClose =
                Math.abs(dy) > currentSnapH * DISTANCE_FRACTION ||
                vy > VELOCITY_THRESHOLD;
              if (shouldClose) {
                close();
                return;
              }
            }
          } else {
            // Move to next lower snap
            const currentSnapH = heights[currentIndex];
            const nextSnapH = heights[currentIndex - 1];
            const distBetween = currentSnapH - nextSnapH;
            const shouldSnap =
              Math.abs(dy) > distBetween * DISTANCE_FRACTION ||
              vy > VELOCITY_THRESHOLD;
            if (shouldSnap) {
              targetIndex = currentIndex - 1;
            }
          }
        } else if (isSwipingUp && upEnabled) {
          if (currentIndex < heights.length - 1) {
            // Move to next higher snap
            const currentSnapH = heights[currentIndex];
            const nextSnapH = heights[currentIndex + 1];
            const distBetween = nextSnapH - currentSnapH;
            const shouldSnap =
              Math.abs(dy) > distBetween * DISTANCE_FRACTION ||
              Math.abs(vy) > VELOCITY_THRESHOLD;
            if (shouldSnap) {
              targetIndex = currentIndex + 1;
            }
          }
        }

        // Snap to target
        snapIndexRef.current = targetIndex;
        const targetTranslateY = maxH - heights[targetIndex];

        Animated.spring(translateY, {
          toValue: targetTranslateY,
          useNativeDriver: true,
          bounciness: 0,
          speed: 14,
        }).start();

        if (targetIndex !== currentIndex) {
          onChange?.(targetIndex);
        }
      },
    }),
  ).current;

  useEffect(() => {
    latestRef.current = {
      snapHeights,
      maxSnapHeight,
      onClose,
      onSnapChange,
      enableSwipeUp,
      enablePanDownToClose,
      getTranslateYForIndex,
    };
  }, [
    snapHeights,
    maxSnapHeight,
    onClose,
    onSnapChange,
    enableSwipeUp,
    enablePanDownToClose,
    getTranslateYForIndex,
  ]);

  // Handle visibility changes
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
      // Reset to off-screen before opening
      translateY.setValue(maxSnapHeight);
      opacity.setValue(0);
      snapIndexRef.current = clampedInitialIndex;
      setShowModal(true);
      requestAnimationFrame(() => animateOpen());
    } else {
      animateClose();
    }
  }, [visible]);

  // Handle snap height changes while not visible
  useEffect(() => {
    if (!isInitialMount.current && !visible) {
      translateY.setValue(maxSnapHeight);
    }
  }, [maxSnapHeight]);

  return {
    showModal,
    translateY,
    opacity,
    panResponder,
    animateOpen,
    animateClose,
    animateToSnap,
    maxSnapHeight,
    currentSnapIndex: snapIndexRef,
  };
};
