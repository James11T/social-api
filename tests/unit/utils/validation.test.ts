import { validateEmail } from "../../../src/utils/validation";

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
