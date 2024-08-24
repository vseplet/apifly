// deno-lint-ignore-file require-await
import apifly from "@vseplet/apifly";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";
import { Hono } from "@hono/hono";

const apiflyServer = new apifly.server<MyApiflyDefinition>()
  .load(async (args) => {
    const state = {
      a: {
        b: "1",
        c: {
          d: true,
        },
      },
    };
    console.log("load!");
    return [state, null];
  })
  .guards({
    a: {
      b: (args) => true,
      c: {
        d: (args) => false,
      },
    },
  })
  .unload(async (args) => {
    console.log("unload!");
    return null;
  })
  .watchers({
    a: {
      b: async (args) => {},
      c: {
        d: async (args) => {},
      },
    },
  })
  .procedure("hi", async (args) => {
    return "Hello, World";
  })
  .procedure("hi2", async (args) => {
    return false;
  })
  .procedure("hi3", async (args) => {
    return [0, 0, 0];
  });

// apiflyServer.guard("a.c.d", () => {});
// apiflyServer.watcher("a.c.d", () => {});

const server = new Hono();
const api = new Hono();
api.post(
  // это можно встраивать и миксовать с основным api
  "/apifly",
  async (c) =>
    c.json(
      await apiflyServer.handleRequest(await c.req.json(), { role: "admin" }),
    ),
);

server.route("/api", api);
Deno.serve(server.fetch);
