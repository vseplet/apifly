// deno-lint-ignore-file no-unused-vars
import type {
  ApiflyDefinition,
  ApiflyFilters,
  ApiflyGuards,
  ApiflyRequest,
  ApiflyResponse,
  ApiflyWatchers,
  InferStateType,
} from "$types";

import { Hono, type Context } from "@hono/hono";

import type { ApiflyManager } from "./ApiflyManager.ts";

/**
 * Apifly server
 */
export class ApiflyServer<D extends ApiflyDefinition<any, any>> {
  constructor(private manager: ApiflyManager<D>) {}

  private handleRequest() {
    throw new Error("not implemented!");
  }

  hono(cb: (c: Context) => D["extra"]) {
    const router = new Hono();
    router.post(
      // это можно встраивать и миксовать с основным api
      "/apifly",
      async (c: Context) =>
        c.json(await this.manager.handleRequest(await c.req.json(), cb(c))),
    );
    return router;
  }

  oak() {
    throw new Error("not implemented!");
  }
}
