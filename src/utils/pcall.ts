import { Err, Ok } from "ts-results";
import type { Result } from "ts-results";

const pcall = <T extends (...args: any) => any, E>(callback: T): Result<ReturnType<T>, E | string> => {
  try {
    const res = callback();
    return Ok(res);
  } catch (e) {
    return Err(String(e));
  }
};

/**
 * Async protected call catches any errors and wraps them in a result object
 *
 * @param callback An async callback
 * @returns The return type of "runnable"
 */
const asyncPcall = async <T extends (...args: any) => Awaited<any>, E>(
  callback: T
): Promise<Result<Awaited<ReturnType<T>>, E | string>> => {
  try {
    const res = await callback();
    return Ok(res);
  } catch (e) {
    return Err(String(e));
  }
};

export { pcall, asyncPcall };
