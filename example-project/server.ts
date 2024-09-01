import apifly from "../source/mod.ts";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";
import { Hono } from "@hono/hono";

const apiflyServer = new apifly.manager<MyApiflyDefinition>()
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
  .filters({
    a: {
      b: (args) => args.currentValue === "1",
      c: {
        d: (args) => args.currentValue,
      },
    },
  })
  .unload(async (args) => {
    console.log("unload!");
    return null;
  })
  .watchers({
    a: {
      b: async (args) => {
        console.log("Watcher on a.b triggered:", args.currentValue);
      },
      c: {
        d: async (args) => {
          console.log("Watcher on a.c.d triggered:", args.currentValue);
        },
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

apifly.guard<MyApiflyDefinition>()(
  "a.c.d",
  ({ currentValue, newValue, state }) => true,
);

apifly.watcher<MyApiflyDefinition>()(
  "a.b",
  async ({ currentValue, state }) => {},
);

apifly.filter<MyApiflyDefinition>()(
  "a.c.d",
  ({ currentValue, state }) => currentValue === true,
);

apifly.loader<MyApiflyDefinition>()(async (args) => {
  const initialState = {
    a: {
      b: "1",
      c: {
        d: true,
      },
    },
  };
  return [initialState, null];
});

apifly.unloader<MyApiflyDefinition>()(async (args) => {
  console.log("Cleanup on unload!");
  return null;
});

const server = new Hono();
const api = new Hono();
api.post("/apifly", async (c) =>
  c.json(
    await apiflyServer.handleRequest(await c.req.json(), { role: "admin" }),
  ),
);

server.route("/api", api);
Deno.serve(server.fetch);
