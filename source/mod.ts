import type { ApiflyDefinition } from "$types";

import { ApiflyClient } from "./ApiflyClient.ts";
import { ApiflyServer } from "./ApiflyServer.ts";

export { ApiflyClient, ApiflyServer };
export const apiflyDefine = <
  S,
  R extends {
    [key: string]: {
      args: any[];
      returns: any;
    };
  },
>(
  state: S,
  rpc: R,
): ApiflyDefinition<S, R> => {
  return {
    state,
    rpc: rpc,
  };
};

export default {
  client: ApiflyClient,
  server: ApiflyServer,
  define: apiflyDefine,
};
