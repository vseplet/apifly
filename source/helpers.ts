import type {
  ApiflyDefinition,
  ApiflyGuard,
  ApiflyWatcher,
  ApiflyFilter,
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
    predicate: ApiflyGuard<
      X["extra"],
      GetValueByKey<X["state"], K>,
      X["state"]
    >,
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

export const filter = <X extends ApiflyDefinition<any, any>>() => {
  return function <K extends NestedKeyOf<X["state"]>>(
    key: K,
    predicate: ApiflyFilter<
      X["extra"],
      GetValueByKey<X["state"], K>,
      X["state"]
    >,
  ): boolean {
    return true;
  };
};

export const loader = <X extends ApiflyDefinition<any, any>>() => {
  return function (
    callback: (args: X["extra"]) => Promise<[X["state"], any]>,
  ): void {};
};

export const unloader = <X extends ApiflyDefinition<any, any>>() => {
  return function (callback: (args: X["extra"]) => Promise<any>): void {};
};
