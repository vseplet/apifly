import apifly from "$apifly";
import type { ApiflyDefinition } from "$types";

type StateDefinition = {
  a: {
    b: string;
    c: {
      d: boolean;
    };
  };
};

type RpcDefinition = {
  hi: {
    args: [string, number];
    returns: string;
  };
  hi2: {
    args: [number];
    returns: boolean;
  };
  hi3: {
    args: [number, boolean, string];
    returns: [number, number, number];
  };
};

export type MyApiflyDefinition = ApiflyDefinition<
  StateDefinition,
  RpcDefinition
>;
