import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

/**
 * A snap point represents a height stop for the bottom sheet.
 * Can be a percentage string (e.g. '50%') or a fixed pixel number.
 */
export type SnapPoint = string | number;

/**
 * Configuration options for the BottomSheet component.
 */
export type BottomSheetProps = {
  /**
   * Controlled visibility of the bottom sheet.
   */
  visible: boolean;

  /**
   * Callback fired when the bottom sheet is closed (either by handle swipe,
   * backdrop press, or close button).
   */
  onClose: () => void;

  /**
   * The content to be rendered inside the bottom sheet.
   */
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
   * @default true
   */
  animateOnMount?: boolean;

  /**
   * Optional custom close icon.
   */
  closeIcon?: ReactNode;

  /**
   * Style applied to the main sheet container.
   */
  sheetStyle?: StyleProp<ViewStyle>;

  /**
   * Style applied to the handle bar (the touchable area).
   */
  handleStyle?: StyleProp<ViewStyle>;

  /**
   * Style applied to the handle indicator (the small horizontal bar).
   */
  handleIndicatorStyle?: StyleProp<ViewStyle>;

  /**
   * Style applied to the container holding both handle and indicator.
   */
  handleContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Style applied to the semi-transparent background overlay.
   */
  backdropStyle?: StyleProp<ViewStyle>;

  /**
   * Style applied to the close button container.
   */
  closeButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Style applied to the content container inside the sheet.
   */
  contentStyle?: StyleProp<ViewStyle>;

  /**
   * If true, the close button in the top right corner will be hidden.
   * @default false
   */
  hideCloseButton?: boolean;
};
