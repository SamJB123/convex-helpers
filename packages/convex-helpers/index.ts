/**
 * asyncMap returns the results of applying an async function over an list.
 *
 * The list can even be a promise, or an iterable like a Set.
 * @param list - Iterable object of items, e.g. an Array, Set, Object.keys
 * @param asyncTransform
 * @returns
 */
export async function asyncMap<FromType, ToType>(
  list: Iterable<FromType> | Promise<Iterable<FromType>>,
  asyncTransform: (item: FromType, index: number) => Promise<ToType>
): Promise<ToType[]> {
  const promises: Promise<ToType>[] = [];
  let index = 0;
  for (const item of await list) {
    promises.push(asyncTransform(item, index));
    index += 1;
  }
  return Promise.all(promises);
}

/**
 * Filters out null elements from an array.
 * @param list List of elements that might be null.
 * @returns List of elements with nulls removed.
 */
export function pruneNull<T>(list: (T | null)[]): T[] {
  return list.filter((i) => i !== null) as T[];
}

export class NullDocumentError extends Error {}

/**
 * Throws if there is a null element in the array.
 * @param list List of elements that might have a null element.
 * @returns Same list of elements with a refined type.
 */
export function nullThrows<T>(doc: T | null, message?: string): T {
  if (doc === null) {
    throw new NullDocumentError(message ?? "Unexpected null document.");
  }
  return doc;
}

// Type utils:

// Copied from convex/server since it wasn't exported
export type EmptyObject = Record<string, never>;
/**
 * An `Omit<>` type that:
 * 1. Applies to each element of a union.
 * 2. Preserves the index signature of the underlying type.
 */
export type BetterOmit<T, K extends keyof T> = {
  [Property in keyof T as Property extends K ? never : Property]: T[Property];
};
/**
 * TESTS
 */
/**
 * Tests if two types are exactly the same.
 * Taken from https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
 * (Apache Version 2.0, January 2004)
 */
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

/**
 * A utility for compile-time type assertions.
 *
 * @example
 * ```ts
 * // Compile-time assertion
 * assert<Equals<1, 1>>();
 * ```
 */
export function assert<_ extends true>() {
  // no need to do anything! we're just asserting at compile time that the type
  // parameter is true.
}
