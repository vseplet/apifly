// MyApiflyDefinition.type.ts
import type { ApiflyDefinition } from "../source/types.ts";

export type MyApiflyDefinition = ApiflyDefinition<
  {
    counter: number;
    message: string;
    user: {
      tg_id: string;
    };
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
