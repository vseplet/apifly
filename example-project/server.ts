// deno-lint-ignore-file require-await
import apifly from "$apifly";
import { definition } from "./definition.ts";
import { Hono } from "@hono/hono";

const server = new apifly.server(definition)
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
  .procedures({
    "hello": async () => {
      return "Hello, world!";
    },
    "random": async () => {
      return Math.random();
    },
  });

const app = new Hono();

app.post(
  "/apifly",
  async (c) => c.json(await server.handleRequest(await c.req.json())),
);

// Deno.serve(app.fetch);
