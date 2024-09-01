import type { ApiflyDefinition } from "$types";
import { ApiflyClient } from "./ApiflyClient.ts";
import { ApiflyManager } from "./ApiflyManager.ts";
import { ApiflyServer } from "./ApiflyServer.ts";
import * as v from "@valibot/valibot";
import { filter, guard, loader, unloader, watcher } from "./helpers.ts";

export { v };
export { ApiflyClient, ApiflyServer };

/**
 * Defines an Apifly definition
 * @param state The state type
 * @param rpc The RPC type
 * @returns The Apifly definition
 */
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
    extra: {},
  };
};

export default {
  watcher,
  guard,
  filter,
  loader,
  unloader,
  client: ApiflyClient,
  manager: ApiflyManager,
  server: ApiflyServer,
  define: apiflyDefine,
  v,
};
