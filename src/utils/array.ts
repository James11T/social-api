/**
 * Coerce a value to an array.
 * Gaurantees that the result is an array.
 *
 * @param value Any input, array, single or nullish
 * @returns An array that either is the input, or contains the input
 */
const alwaysArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (!value) return []; // Value is null or undefined
  if (Array.isArray(value)) return value; // Value is already an array
  return [value]; // Value is a single item
};

/**
 * Remove all duplicates from an array.
 *
 * @param value An array of values
 * @returns The given array with all duplicates removed
 */
const removeDuplicates = <T>(value: T[]): T[] => [...new Set(value)];

export { alwaysArray, removeDuplicates };
