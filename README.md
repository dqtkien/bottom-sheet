# @hunter-lab/bottom-sheet

A beautifully simple, lightweight, and customizable Bottom Sheet Modal for React Native.

**Zero dependencies.** No `react-native-reanimated`, no `react-native-gesture-handler`, no bloated third-party libraries. Built purely with React Native's native `Animated` and `PanResponder` APIs. If you are tired of dealing with complex worklets, massive dependency trees, and native module linking issues just to get a bottom sheet, this package is for you!

## Features

- 🚀 **100% Dependency Free**: Just React and React Native.
- 🪶 **Ultra Lightweight**: Zero external bridging or heavy third-party animation libraries.
- 📱 **Cross-Platform**: Works smoothly on both iOS and Android.
- ⚙️ **Highly Customizable**: Easily style the backdrop, handle, and content.
- 📦 **Modern Architecture**: Full support for both ESM and CommonJS.
- 🛡️ **TypeScript Ready**: First-class type definitions included natively.

## Installation

```bash
npm install @hunter-lab/bottom-sheet
```

_or if you prefer yarn:_

```bash
yarn add @hunter-lab/bottom-sheet
```

## Usage

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

## Customization

You can fully customize the look and feel using the following props:

- `visible` (boolean) - Toggles modal visibility.
- `onClose` (function) - Callback fired when the bottom sheet is closed via swipe or backdrop press.
- `snapPoints` (string[]) - Array of string percentages to define height (e.g. `['33%']`).
- `sheetStyle` (StyleProp<ViewStyle>) - Style the modal sheet container.
- `backdropStyle` (StyleProp<ViewStyle>) - Style the modal backdrop.
- `handleStyle` (StyleProp<ViewStyle>) - Style the top drag handle.
- `closeIcon` (ReactNode) - Override the default close icon.
- `closeButtonStyle` (StyleProp<ViewStyle>) - Style the close icon wrapper.
- `hideCloseButton` (boolean) - Hide the close button entirely.

## License

MIT
