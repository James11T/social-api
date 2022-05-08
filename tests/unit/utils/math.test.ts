import { clamp } from "../../../src/utils/math";

describe("clamp", () => {
  it("should clamp up to min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(Number.MIN_SAFE_INTEGER, 0, 10)).toBe(0);
  });

  it("should clamp at min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("should allow valid value", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("should clamp at max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("should clamp down to max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(Number.MAX_SAFE_INTEGER, 0, 10)).toBe(10);
  });
});
