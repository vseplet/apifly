import type { ApiflyDefinition, ApiflyGuard, NestedKeyOf } from "$types";

export const procedure = <X>(
  name: string,
  fn: (state: X) => Promise<void>,
) => {};

export const watcher = <X>() => {};

export const filter = <X>() => {};

export function guard<X extends ApiflyDefinition<any, any>>(
  key: NestedKeyOf<X["state"]>,
  predicate: ApiflyGuard<X["extra"], any, X["state"]>,
): boolean;

export function guard<
  X extends ApiflyDefinition<any, any>,
  K extends NestedKeyOf<X["state"]>,
>(
  key: K,
  predicate: ApiflyGuard<X["extra"], K, X["state"]>,
): boolean {
  return true;
}
export const loader = <X>() => {};

export const unloader = <X>() => {};
