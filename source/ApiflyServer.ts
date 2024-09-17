// ApiflyServer.ts
import type {
  ApiflyDefinition,
  ApiflyRequest,
  ApiflyResponse,
  InferStateType,
} from "$types";

import { Hono } from "jsr:@hono/hono";
import type { Context } from "jsr:@hono/hono";

import type { ApiflyManager } from "./ApiflyManager.ts";

export class ApiflyServer<D extends ApiflyDefinition<any, any>> {
  private router: Hono;

  constructor(
    private manager: ApiflyManager<D>,
    private basePath: string = "/",
    private extraCallback: (c: Context) => D["extra"] =
      () => ({} as D["extra"]),
  ) {
    this.router = new Hono();

    this.router.post(
      this.basePath,
      async (c: Context) => {
        const requestData = await c.req.json();
        console.log("Incoming request:", requestData);
        const response = await this.manager.handleRequest(
          requestData,
          this.extraCallback(c),
        );
        console.log("Outgoing response:", response);
        return c.json(response);
      },
    );
  }

  /**
   * Регистрирует маршруты на указанном сервере Hono
   */
  registerRoutes(server: Hono) {
    server.route("/", this.router);
  }
}
