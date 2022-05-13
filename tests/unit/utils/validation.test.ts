import { PasswordRequirements } from "../../../src/constants";
import { validateEmail, validatePassword } from "../../../src/validation/data";

// https://gist.github.com/cjaoude/fd9910626629b53c4d25

const validEmails = [
  "email@example.com",
  "firstname.lastname@example.com",
  "email@subdomain.example.com",
  "firstname+lastname@example.com",
  '"email"@example.com',
  "1234567890@example.com",
  "email@example-one.com",
  "_______@example.com",
  "email@example.name",
  "email@example.museum",
  "email@example.co.jp",
  "firstname-lastname@example.com"
];

const invalidEmails = [
  "plainaddress",
  "#@%^%#$@#$@#.com",
  "@example.com",
  "Joe Smith <email@example.com>",
  "email.example.com",
  "email@example@example.com",
  ".email@example.com",
  "email.@example.com",
  "email..email@example.com",
  "email@example.com (Joe Smith)",
  "email@example",
  "email@-example.com",
  "email@111.222.333.44444",
  "email@example..com",
  "Abc..123@example.com",
  "”(),:;<>[\\]@example.com",
  'this\\ is"really"not\\allowed@example.com'
];

describe("email validation", () => {
  it("should be valid with regular email", () => {
    expect(validateEmail("example@example.com")).toBeTruthy();
  });

  it(`should return true for ${validEmails.length} valid emails`, () => {
    const isValid = validEmails.reduce(
      (prev, curr) => prev && validateEmail(curr),
      true
    );

    expect(isValid).toBeTruthy();
  });

  it(`should return false for ${invalidEmails.length} invalid emails`, () => {
    const isInvalid = invalidEmails.reduce(
      (prev, curr) => prev && !validateEmail(curr),
      true
    );

    expect(isInvalid).toBeTruthy();
  });
});

const passwordOptions = {
  minPasswordLength: 0,
  maxPasswordLength: Number.MAX_SAFE_INTEGER,
  minSpecialCharacters: 0,
  minNumbers: 0,
  mustVaryCase: false,
  nonSpecialCharacters: /[a-zA-Z0-9 ]/g
};

const proxyValidPassword = (
  password: string,
  options: PasswordRequirements = {}
) => validatePassword(password, { ...passwordOptions, ...options });

describe("password validation", () => {
  it("should accept with standard paramters and valid password", () => {
    expect(proxyValidPassword("password")).toBeTruthy();
  });

  describe("lengths", () => {
    it("should accept a valid length password", () => {
      expect(
        proxyValidPassword("12345678", {
          minPasswordLength: 5,
          maxPasswordLength: 10
        })
      ).toBeTruthy();
    });

    it("should reject too short password", () => {
      expect(proxyValidPassword("1", { minPasswordLength: 10 })).toBeFalsy();
    });

    it("should reject too long password", () => {
      expect(
        proxyValidPassword("12345678", {
          maxPasswordLength: 5
        })
      ).toBeFalsy();
    });
  });

  describe("special characters", () => {
    it("should accept with minimum special characters", () => {
      expect(
        proxyValidPassword("specialcharacter@@@", { minSpecialCharacters: 3 })
      ).toBeTruthy();
    });

    it("should accept with more than minimum special characters", () => {
      expect(
        proxyValidPassword("specialcharacter@@@@@@@", {
          minSpecialCharacters: 3
        })
      ).toBeTruthy();
    });

    it("should reject with less than minimum special characters", () => {
      expect(
        proxyValidPassword("specialcharacter@@", { minSpecialCharacters: 3 })
      ).toBeFalsy();
    });
  });

  describe("numbers", () => {
    it("should accept with minimum numbers", () => {
      expect(
        proxyValidPassword("somenumbers123", { minNumbers: 3 })
      ).toBeTruthy();
    });

    it("should accept with more than minimum numbers", () => {
      expect(
        proxyValidPassword("somenumbers1234567", { minNumbers: 5 })
      ).toBeTruthy();
    });

    it("should reject with less than minimum numbers", () => {
      expect(
        proxyValidPassword("somenumbers12", { minNumbers: 3 })
      ).toBeFalsy();
    });
  });

  describe("case", () => {
    it("should accept with any case", () => {
      expect(
        proxyValidPassword("abcdefghijkl", { mustVaryCase: false })
      ).toBeTruthy();
      expect(
        proxyValidPassword("ABCDEFGHIJKL", { mustVaryCase: false })
      ).toBeTruthy();
      expect(
        proxyValidPassword("AbCdEfGhIjKl", { mustVaryCase: false })
      ).toBeTruthy();
    });

    it("should reject with unvaried upper case", () => {
      expect(
        proxyValidPassword("ABCDEFGHIJKL", { mustVaryCase: true })
      ).toBeFalsy();
    });

    it("should reject with unvaried lower case", () => {
      expect(
        proxyValidPassword("abcdefghijkl", { mustVaryCase: true })
      ).toBeFalsy();
    });

    it("should accept with varied case", () => {
      expect(
        proxyValidPassword("AbCdEfGhIjKl", { mustVaryCase: true })
      ).toBeTruthy();
    });
  });
});
