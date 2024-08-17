# apifly

[![JSR](https://jsr.io/badges/@vseplet/apifly)](https://jsr.io/@vseplet/apifly)

## 👋 👋 ATTENTION!

> This package is under development and will be frequently updated. The author
> would appreciate any help, advice, and pull requests! Thank you for your
> understanding 😊

**apifly** is a small typed library designed for state sharing in client-server
applications and remote procedure calls for different runtime environments.

## Quick Start:

#### 1. Обределить тип состояния и процедур в **MyApiflyDefinition.ts**:

```ts
import { ApiflyDefinition } from "@vseplet/apifly/types";

export type MyApiflyDefinition = ApiflyDefinition<
  {
    a: {
      b: string;
      c: {
        d: boolean;
      };
    };
  },
  {
    hi: {
      args: [];
      returns: string;
    };
  }
>;
```

#### 2. Создать клиент (используется @vseplet/fetchify):

```ts
import apifly from "@vseplet/apifly";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";

export const client = new apifly.client<MyApiflyDefinition>({
  baseURL: "http://localhost:8000/api/apifly",
  limiter: {
    unlimited: true,
  },
});
```

#### 3. Создать сервер (на примере hono):

```ts
import apifly from "@vseplet/apifly";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.ts";
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
  .procedure("hi", async (args) => {
    return "Hello, World";
  });

const server = new Hono();
const api = new Hono();
api.post( // это можно встраивать и миксовать с основным api
  "/apifly",
  async (c) => c.json(await apiflyServer.handleRequest(await c.req.json())),
);
server.route("/api", api);
Deno.serve(server.fetch);
```
