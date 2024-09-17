// ApiflyServer.ts

import type { ApiflyDefinition } from "$types";
import { type Context, Hono } from "jsr:@hono/hono";
import type { ApiflyManager } from "./ApiflyManager.ts";

export class ApiflyServer<D extends ApiflyDefinition<any, any>> {
  private router: Hono;

  constructor(
    private manager: ApiflyManager<D>,
    private basePath: string = "/",
    private getExtraFromContext: (c: Context) => D["extra"] =
      () => ({} as D["extra"]),
  ) {
    this.router = new Hono();

    this.router.post(
      this.basePath,
      async (c: Context) => {
        const requestData = await c.req.json();
        console.log("Incoming request:", requestData);

        // Извлекаем extra данные из заголовков
        const extra = this.getExtraFromContext(c);

        const response = await this.manager.handleRequest(
          requestData,
          extra,
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
