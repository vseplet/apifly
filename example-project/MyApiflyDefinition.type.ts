import type { ApiflyDefinition } from "@vseplet/apifly/types";

export type MyApiflyDefinition = ApiflyDefinition<
  {
    a: {
      b: string;
      c: {
        d: boolean;
      };
    };
  },
  {
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
  },
  {
    role: "admin" | "user";
  }
>;
