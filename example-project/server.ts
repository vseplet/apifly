// deno-lint-ignore-file require-await
import { guard } from "../source/helpers.ts";
import apifly from "../source/mod.ts";
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
  // .guards({
  //   a: {
  //     b: (args) => true,
  //     c: {
  //       d: (args) => false,
  //     },
  //   },
  // })
  // .unload(async (args) => {
  //   console.log("unload!");
  //   return null;
  // })
  // .watchers({
  //   a: {
  //     b: async (args) => {},
  //     c: {
  //       d: async (args) => {},
  //     },
  //   },
  // })
  .procedure("hi", async (args) => {
    return "Hello, World";
  })
  .procedure("hi2", async (args) => {
    return false;
  })
  .procedure("hi3", async (args) => {
    return [0, 0, 0];
  });

guard<MyApiflyDefinition>("a.c.d", ({ currentValue, newValue, state }) => true);
// apiflyServer.watcher("a.c.d", () => {});

const server = new Hono();
const api = new Hono();
api.post(
  // это можно встраивать и миксовать с основным api
  "/apifly",
  //@ts-ignore
  async (c) =>
    c.json(
      await apiflyServer.handleRequest(await c.req.json(), { role: "admin" }),
    ),
);

server.route("/api", api);
Deno.serve(server.fetch);
