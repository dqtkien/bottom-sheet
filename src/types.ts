import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export type SnapPoint = string | number;

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;

  /**
   * An array of snap points for the bottom sheet.
   * - `string`: percentage of screen height, e.g. '10%', '50%'
   * - `number`: absolute pixel value, e.g. 200, 400
   *
   * The array is automatically sorted ascending. The sheet opens at the
   * lowest snap point and can be swiped up/down through each stop.
   *
   * @default ['33%']
   * @example ['10%', '30%', '80%']
   * @example [100, '50%', '90%']
   */
  snapPoints?: SnapPoint[];

  /**
   * Which snap point index to open at (after sorting).
   * @default 0 (the lowest snap point)
   */
  initialSnapIndex?: number;

  /**
   * Called when the sheet snaps to a different snap point.
   * Receives the new snap index (after sorting).
   */
  onSnapChange?: (index: number) => void;

  /**
   * If true, the user can swipe up on the handle to move to higher snap points.
   * @default true
   */
  enableSwipeUp?: boolean;

  /**
   * If true, the bottom sheet will be closed when the user pans down past the lowest snap point.
   * If false, the bottom sheet will just snap back to the lowest snap point.
   * @default true
   */
  enablePanDownToClose?: boolean;

  /**
   * If true (default), the bottom sheet animates in when first mounted with visible=true.
   * If false, it simply appears instantly without animation.
   */
  animateOnMount?: boolean;

  // Customization Props
  closeIcon?: ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  closeButtonStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  hideCloseButton?: boolean;
};
