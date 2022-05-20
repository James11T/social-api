/**
 * Return the current ammount of memory used by the process in megabytes to 2dp.
 *
 * @returns The ammount currently in use in bytes
 */
const getMemeoryUsage = () => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  return `${used.toFixed(2)} MB`;
};

export { getMemeoryUsage };
