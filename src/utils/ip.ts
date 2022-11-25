import geoip from "geoip-country";
import { Ok, Err } from "ts-results";
import countryCodeEmoji from "country-code-emoji";
import type { Result } from "ts-results";

const FAIL_COUNTRY_CODE = "ZZ";

const IPToCountry = (ip: string) => {
  const geoData = geoip.lookup(ip);

  if (!geoData) return FAIL_COUNTRY_CODE;
  return geoData.country;
};

type CountryToEmojiErrors = "INVALID_COUNTRY";

const countryToEmoji = (
  countryCode: string
): Result<string, CountryToEmojiErrors> => {
  if (countryCode === FAIL_COUNTRY_CODE) return Ok("❓");

  try {
    return Ok(countryCodeEmoji(countryCode));
  } catch (err) {
    return Err("INVALID_COUNTRY");
  }
};

const IPToCountryEmoji = (ip: string): Result<string, CountryToEmojiErrors> => {
  const countryCode = IPToCountry(ip);

  const countryEmoji = countryToEmoji(countryCode);
  if (countryEmoji.err) return Err(countryEmoji.val);

  return Ok(countryEmoji.val);
};

export { IPToCountry, countryToEmoji, IPToCountryEmoji };
