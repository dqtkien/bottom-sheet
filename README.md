# @hunter-lab/bottom-sheet

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/dqtkien/bottom-sheet)
[![License: MIT](https://img.shields.io/badge/license-MIT-success.svg)](https://opensource.org/licenses/MIT)
![Types: included](https://img.shields.io/badge/types-included-blue.svg)
![Runs with Expo](https://img.shields.io/badge/Runs_with_Expo-4630EB.svg?style=flat&logo=EXPO&labelColor=f3f3f3&logoColor=000)

A beautifully simple, lightweight, and customizable Bottom Sheet Modal for React Native.

If you are tired of dealing with massive dependency trees, complex worklets, and native module linking issues just to get a bottom sheet, this package is for you!

> [!TIP]
> **Why use this?**
>
> - 📦 **Zero Dependencies:** No `react-native-reanimated`, no `react-native-gesture-handler`.
> - ⚛️ **Pure React Native:** Built purely with the native `Animated` and `PanResponder` APIs.
> - 🚀 **Performance:** Optimized with `useNativeDriver: true` for buttery smooth 60FPS animations.

## ✨ Features

- 🚀 **100% Dependency Free**: Just React and React Native.
- 🪶 **Ultra Lightweight**: Zero external bridging or heavy third-party animation libraries.
- 🤏 **Multi-Snap Points**: Define multiple stops (e.g., `['10%', '50%', '90%']`) for your sheet.
- 🖐️ **Full-Surface Swipability**: Swipe up or down from anywhere on the sheet, not just the handlebar.
- 📱 **Cross-Platform**: Works smoothly on both iOS and Android.
- ⚙️ **Highly Customizable**: Easily style the backdrop, handle, and content.
- 📦 **Modern Architecture**: Full support for both ESM and CommonJS.
- 🛡️ **TypeScript Ready**: First-class type definitions included natively.

## 📦 Installation

```bash
npm install @hunter-lab/bottom-sheet
```

_or if you prefer yarn:_

```bash
yarn add @hunter-lab/bottom-sheet
```

## 🚀 Usage

```tsx
import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { BottomSheet } from "@hunter-lab/bottom-sheet";

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Bottom Sheet" onPress={() => setVisible(true)} />

      <BottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        snapPoints={["25%", "50%", "90%"]}
        initialSnapIndex={0} // Start at 25%
        onSnapChange={(index) => console.log("Snapped to:", index)}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Hello from Bottom Sheet!</Text>
          <Text>Swipe up to expand, swipe down to minimize or close.</Text>
          <Text style={styles.body}>
            No reanimated, no gesture handler. Pure React Native performance.
          </Text>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
```

## ⚙️ Props

| Prop                   | Type                      | Default    | Description                                                                        |
| ---------------------- | ------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| `visible`              | `boolean`                 | `required` | Controls the visibility of the modal.                                              |
| `onClose`              | `() => void`              | `required` | Callback fired when the bottom sheet is closed via swipe or backdrop press.        |
| `snapPoints`           | `(string \| number)[]`    | `['33%']`  | Array of heights. `string` for % (e.g. `'50%'`), `number` for pixels (e.g. `400`). |
| `initialSnapIndex`     | `number`                  | `0`        | Which snap point index to open at (after auto-sorting ascending).                  |
| `onSnapChange`         | `(index: number) => void` | `-`        | Callback fired when the sheet snaps to a different point.                          |
| `enableSwipeUp`        | `boolean`                 | `true`     | If false, disables swiping up to higher snap points.                               |
| `enablePanDownToClose` | `boolean`                 | `true`     | If false, the sheet will snap back to the lowest point instead of closing.         |
| `animateOnMount`       | `boolean`                 | `true`     | If true, animates the bottom sheet in when first mounted with `visible=true`.      |
| `hideCloseButton`      | `boolean`                 | `false`    | If true, hides the default "X" close button.                                       |
| `closeIcon`            | `ReactNode`               | `-`        | Custom element to replace the default close icon.                                  |
| `sheetStyle`           | `StyleProp<ViewStyle>`    | `-`        | Style for the modal sheet container.                                               |
| `contentStyle`         | `StyleProp<ViewStyle>`    | `-`        | Style for the content area (inside the sheet).                                     |
| `backdropStyle`        | `StyleProp<ViewStyle>`    | `-`        | Style for the darkened backdrop overlay.                                           |
| `handleIndicatorStyle` | `StyleProp<ViewStyle>`    | `-`        | Style for the bar indicator in the handle.                                         |
| `handleContainerStyle` | `StyleProp<ViewStyle>`    | `-`        | Style for the container surrounding the handle bar.                                |
| `closeButtonStyle`     | `StyleProp<ViewStyle>`    | `-`        | Style for the close button wrapper.                                                |

## ⚡ Performance

This modal is built with performance in mind. Unlike many other libraries that require complex gesture handlers:

- It uses **Native Driver** for all opening/closing animations, ensuring they run on the UI thread and stay at 60FPS even when the JS thread is busy.
- It calculates dimensions dynamically using `useWindowDimensions` for responsiveness.
- It is memoized internally to prevent unnecessary re-renders.
- **Gesture Support**: Uses `PanResponder` for responsive, lag-free dragging across the entire sheet surface.

## 📄 License

MIT
