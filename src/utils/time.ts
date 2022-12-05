/**
 * If no date is passed, returns the current amount of time in seconds since 1970
 * If a date is passed, returns amount of time between date and 1970 in seconds
 *
 * @param date Optional date to get the epoch for
 * @returns Current epoch in ms
 */
const getEpoch = ({
  date,
  truncate = false
}: { date?: Date; truncate?: boolean } = {}): number => {
  const now = Number(date ? date : new Date()) / 1000;
  if (truncate) return Math.floor(now);
  return now;
};

export { getEpoch };
