import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: string[]; // E.g. ['33%']

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
