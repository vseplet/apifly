import type { ApiflyDefinition } from "$types";

import { ApiflyClient } from "./ApiflyClient.ts";
import { ApiflyServer } from "./ApiflyServer.ts";

export { ApiflyClient, ApiflyServer };
export const apiflyDefine = <
  S,
>(
  state: S,
): ApiflyDefinition<S> => {
  return {
    state,
  };
};

export default {
  client: ApiflyClient,
  server: ApiflyServer,
  define: apiflyDefine,
};
