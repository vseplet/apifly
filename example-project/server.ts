// deno-lint-ignore-file require-await
import apifly from "$apifly";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";
import { Hono } from "@hono/hono";

const server = new apifly.server<MyApiflyDefinition>()
  .guards({
    "a": {
      "b": (state, value, patch) => patch === "1",
      "c": {
        "d": (state, value, patch) => patch === true,
      },
    },
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

const app = new Hono();

app.post(
  "/apifly",
  async (c) => c.json(await server.handleRequest(await c.req.json())),
);

// Deno.serve(app.fetch);
