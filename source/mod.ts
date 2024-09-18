import type { ApiflyDefinition } from "$types";
import { ApiflyClient } from "./ApiflyClient.ts";
import { ApiflyManager } from "./ApiflyManager.ts";
import { ApiflyServer } from "./ApiflyServer.ts";
import { filter, guard, loader, unloader, watcher } from "./helpers.ts";

export { ApiflyClient, ApiflyServer };

/**
 * Определяет структуру Apifly.
 *
 * @template S - Тип состояния.
 * @template R - Тип RPC, который включает в себя набор процедур с аргументами и возвращаемыми значениями.
 *
 * @param {S} state - Начальное состояние.
 * @param {R} rpc - Определение процедур RPC с аргументами и возвращаемыми значениями.
 * @returns {ApiflyDefinition<S, R>} - Возвращает объект, представляющий определение Apifly с состоянием, RPC и дополнительными параметрами.
 *
 * @example
 * const definition = apiflyDefine(
 *   { counter: 0, message: "" },
 *   { increment: { args: [number], returns: void } }
 * );
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
};
