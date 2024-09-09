import type { ApiflyDefinition } from "../source/types.ts";

export type MyApiflyDefinition = ApiflyDefinition<
  {
    counter: number;
    message: string;
  },
  {
    incrementCounter: {
      args: [number];
      returns: string;
    };
    resetCounter: {
      args: [];
      returns: string;
    };
    getMessage: {
      args: [];
      returns: string;
    };
  },
  {}
>;
