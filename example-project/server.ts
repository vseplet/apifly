// deno-lint-ignore-file require-await
import apifly from "$apifly";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";
import { Hono } from "@hono/hono";

const apiflyServer = new apifly.server<MyApiflyDefinition>()
  .load(async () => {
    return {
      a: {
        b: "1",
        c: {
          d: true,
        },
      },
    };
  })
  .guards({
    "a": {
      "b": (state, value, patch) => patch === "1",
      "c": {
        "d": (state, value, patch) => patch === true,
      },
    },
  })
  .store(async (state) => {
    console.log(state);
  })
  .watchers({
    "a": {
      "b": async (_state) => {},
      "c": {
        "d": async (_state) => {},
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

const server = new Hono();
const api = new Hono();
api.post( // это можно встраивать и миксовать с основным api
  "/apifly",
  async (c) => c.json(await apiflyServer.handleRequest(await c.req.json())),
);
server.route("/api", api);
Deno.serve(server.fetch);
