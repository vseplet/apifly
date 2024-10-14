// ApiflyServer.ts

import type { ApiflyDefinition } from "$types";
import { type Context, Hono } from "@hono/hono";
import type { ApiflyManager } from "./ApiflyManager.ts";

export class ApiflyServer<D extends ApiflyDefinition<any, any>> {
  private router: Hono;

  constructor(
    private manager: ApiflyManager<D>,
    private basePath: string = "/",
    private headerMappings?: Record<keyof D["extra"], string>,
  ) {
    this.router = new Hono();

    this.router.post(
      this.basePath,
      async (c: Context) => {
        const requestData = await c.req.json();
        console.log("Incoming request:", requestData);

        const extra = this.extractExtraFromHeaders(c);

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
   * Регистрирует маршруты на указанном сервере Hono.
   */
  registerRoutes(server: Hono) {
    server.route("/", this.router);
  }

  /**
   * Извлекает extra данные из заголовков на основе соответствий
   */
  private extractExtraFromHeaders(c: Context): D["extra"] {
    const extra: Partial<D["extra"]> = {};

    if (this.headerMappings) {
      for (const [field, headerName] of Object.entries(this.headerMappings)) {
        const headerValue = c.req.header(headerName as string);
        if (headerValue) {
          (extra as any)[field] = headerValue;
        }
      }
    }

    return extra as D["extra"];
  }
}
