// deno-lint-ignore-file no-unused-vars no-case-declarations
import type {
  ApiflyDefinition,
  ApiflyRequest,
  ApiflyResponse,
  InferStateType,
} from "$types";

import { type Context, Hono } from "@hono/hono";

import type { ApiflyManager } from "./ApiflyManager.ts";

export class ApiflyServer<D extends ApiflyDefinition<any, any>> {
  constructor(private manager: ApiflyManager<D>) {}

  hono(cb: (c: Context) => D["extra"]) {
    const router = new Hono();
    router.post(
      "/apifly",
      async (c: Context) => {
        console.log("Incoming request:", await c.req.json());
        const response = await this.manager.handleRequest(
          await c.req.json(),
          cb(c),
        );
        console.log("Outgoing response:", response);
        return c.json(response);
      },
    );
    return router;
  }
}
