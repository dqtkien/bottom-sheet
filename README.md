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
        snapPoints={["50%"]} // Customize the height of the modal
      >
        <View style={styles.content}>
          <Text style={styles.title}>Hello from Bottom Sheet!</Text>
          <Text>No reanimated, no gesture handler. Pure React Native.</Text>
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
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
```

## ⚙️ Props

| Prop               | Type                   | Default    | Description                                                                 |
| ------------------ | ---------------------- | ---------- | --------------------------------------------------------------------------- |
| `visible`          | `boolean`              | `required` | Controls the visibility of the modal.                                       |
| `onClose`          | `() => void`           | `required` | Callback fired when the bottom sheet is closed via swipe or backdrop press. |
| `snapPoints`       | `string[]`             | `['33%']`  | Array of height percentages (e.g. `['50%']`).                               |
| `sheetStyle`       | `StyleProp<ViewStyle>` | `-`        | Style for the modal sheet container.                                        |
| `contentStyle`     | `StyleProp<ViewStyle>` | `-`        | Style for the content area (inside the sheet).                              |
| `backdropStyle`    | `StyleProp<ViewStyle>` | `-`        | Style for the darkened backdrop overlay.                                    |
| `handleStyle`      | `StyleProp<ViewStyle>` | `-`        | Style for the top drag handle indicator.                                    |
| `closeIcon`        | `ReactNode`            | `-`        | Custom element to replace the default close icon.                           |
| `closeButtonStyle` | `StyleProp<ViewStyle>` | `-`        | Style for the close button wrapper.                                         |
| `hideCloseButton`  | `boolean`              | `false`    | If true, hides the close button entirely.                                   |

## ⚡ Performance

This modal is built with performance in mind. Unlike many other libraries that require complex gesture handlers:

- It uses **Native Driver** for all opening/closing animations, ensuring they run on the UI thread and stay at 60FPS even when the JS thread is busy.
- It calculates dimensions dynamically using `useWindowDimensions` for responsiveness.
- It is memoized internally to prevent unnecessary re-renders.

## 📄 License

MIT
