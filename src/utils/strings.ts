/**
 * Count the occourences of a regex in a string
 *
 * @param str The string to check
 * @param match The RegExp to match to
 * @returns The ammount of occurances of the match
 */
const countOccurrences = (str: string, match: RegExp) => {
  const exp = match.global
    ? match
    : new RegExp(match.source, `g${match.flags}`);

  const matches = str.match(exp) || [];
  return matches.length;
};

export { countOccurrences };
