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

/**
 * Strip the last file extention from a filename
 *
 * selfie.png -> selfie
 *
 * .env -> .env
 *
 * @param filename Any filename, with or without extention
 * @returns The filename without the final extention
 */
const stripFileExtention = (filename: string) => {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
  // TODO: Test
};

export { countOccurrences, stripFileExtention };
