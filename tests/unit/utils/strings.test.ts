import { countOccurrences } from "../../../src/utils/strings";

describe("count occurrences", () => {
  it("should find 1 occurence", () => {
    const str = "abcdefghijklmnopqrstuvwxyz";
    const match = /j/g;
    const result = countOccurrences(str, match);
    expect(result).toBe(1);
  });

  it("should return the ammount of matches global expression", () => {
    const str = "abcabcabc";
    const match = /abc/g;
    const result = countOccurrences(str, match);
    expect(result).toBe(3);
  });

  it("should return the ammount of matches non-global expression", () => {
    const str = "abcabcabc";
    const match = /abc/;
    const result = countOccurrences(str, match);
    expect(result).toBe(3);
  });

  it("should return 0 if no matches", () => {
    const str = "abcabcabc";
    const match = /xyz/;
    const result = countOccurrences(str, match);
    expect(result).toBe(0);
  });

  it("should work with complex expression", () => {
    // https://regex101.com/r/dT0vT3/1
    const ipRegex =
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g;
    const str = "127.0.0.1,192.168.0.1";
    const result = countOccurrences(str, ipRegex);
    expect(result).toBe(2);
  });
});
