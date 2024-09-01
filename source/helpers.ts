import type {
  ApiflyDefinition,
  ApiflyGuard,
  ApiflyWatcher,
  GetValueByKey,
  NestedKeyOf,
} from "$types";

export const procedure = <X>(
  name: string,
  fn: (state: X) => Promise<void>,
) => {};

export function guard<X extends ApiflyDefinition<any, any>>() {
  return function <K extends NestedKeyOf<X["state"]>>(
    key: K,
    predicate: (
      args: {
        currentValue: GetValueByKey<X["state"], K>;
        newValue: GetValueByKey<X["state"], K>;
        state: X["state"];
      } & X["extra"],
    ) => boolean,
  ): boolean {
    return true;
  };
}

export function watcher<X extends ApiflyDefinition<any, any>>() {
  return function <K extends NestedKeyOf<X["state"]>>(
    key: K,
    callback: ApiflyWatcher<
      X["extra"],
      GetValueByKey<X["state"], K>,
      X["state"]
    >,
  ): void {};
}

export const filter = <X>() => {};

export const loader = <X>() => {};

export const unloader = <X>() => {};
