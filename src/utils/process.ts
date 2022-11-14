/**
 * Return the current amount of memory used by the process in megabytes to 2dp.
 *
 * @returns The amount currently in use in bytes
 */
const getMemoryUsage = (): string => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  return `${used.toFixed(2)} MB`;
};

export { getMemoryUsage };
