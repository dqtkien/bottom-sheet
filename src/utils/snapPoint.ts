import { SnapPoint } from "../types";

/**
 * Resolves an array of snap points (strings like '10%' or numbers in px)
 * into sorted ascending pixel values.
 *
 * @param snapPoints - Array of snap points (e.g. ['10%', 200, '80%'])
 * @param windowHeight - The screen height in pixels
 * @returns Sorted ascending array of pixel heights
 */
export function resolveSnapPoints(
  snapPoints: SnapPoint[],
  windowHeight: number,
): number[] {
  const resolved = snapPoints.map((sp) => {
    if (typeof sp === "number") {
      return sp;
    }
    // String — must be in percentage format like '10%'
    const match = sp.match(/^([\d.]+)%$/);
    if (match) {
      return (windowHeight * parseFloat(match[1])) / 100;
    }
    // Fallback: try parsing as a number string
    const parsed = parseFloat(sp);
    if (!isNaN(parsed)) {
      return parsed;
    }
    // Invalid format — fall back to 33% of screen
    console.warn(
      `[BottomSheet] Invalid snap point "${sp}", falling back to 33%`,
    );
    return (windowHeight * 33) / 100;
  });

  // Sort ascending (smallest first)
  return resolved.sort((a, b) => a - b);
}
