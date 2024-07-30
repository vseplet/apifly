import { ApiflyServer } from "$apifly";
import { InitialState } from "./InitialState.ts";
import { Hono } from "@hono/hono";

const server = new ApiflyServer(InitialState);

server.guards({
  "a": {
    "b": (state, value, patch) => patch === "1",
    "c": {
      "d": (state, value, patch) => patch === true,
    },
  },
});

server.watchers({
  "a": {
    "b": async (_state) => {},
    "c": {
      "d": async (_state) => {},
    },
  },
});

const app = new Hono();
app.get("/state", (c) => c.text("get state"));
app.patch("/state", (c) => c.text("patch state"));
app.post("/call", (c) => c.text("call proc"));
// Deno.serve(app.fetch)
