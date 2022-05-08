/**
 * Clamp a value between a given min and max
 *
 * clamp(-5, 0, 10) -> 0
 * clamp(0,  0, 10) -> 0
 * clamp(5,  0, 10) -> 5
 * clamp(10, 0, 10) -> 10
 * clamp(15, 0, 10) -> 10
 *
 * @param value The value to be clamped
 * @param min The minimum value
 * @param max The maximum value
 * @returns Value clamped between min and max
 */
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export { clamp };
