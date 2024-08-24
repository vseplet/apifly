import { ApiflyDefinition } from "$types";

export const procedure = <X>(
  name: string,
  fn: (state: X) => Promise<void>,
) => {};

export const watcher = <X>() => {};

export const guard = <X extends ApiflyDefinition<any, any>>() => {};

export const loader = <X>() => {};

export const unloader = <X>() => {};
