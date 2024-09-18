<h1 align="center">Apifly</h1>

<p align="center">
  <img src="https://artpani.sirv.com/Images/projects/apifly/apifly.webp" alt="Apifly" style="width: 200px;"/>
</p>

<p align="center">
  <a href="https://jsr.io/@vseplet/apifly" target="_blank">
    <img src="https://jsr.io/badges/@vseplet/apifly" alt="Apifly JSR Badge" />
  </a>
</p>

<div align="center">
  <i>Apifly - лёгкая и гибкая библиотека для организации клиент-серверного взаимодействия, поддерживающая RPC и обмен состоянием с возможностью кэширования, фильтров, guards и watchers.</i>
</div>

<h2>Содержание:</h2>
<ul>
  <li><a href="#описание">Описание</a></li>
  <li><a href="#быстрый-старт">Быстрый старт</a></li>
  <ul>
    <li><a href="#1-определение-состояния-и-процедур">1. Определение состояния и процедур</a></li>
    <li><a href="#2-настройка-сервера">2. Настройка сервера</a></li>
    <li><a href="#3-создание-клиента">3. Создание клиента</a></li>
  </ul>
  <li><a href="#пример-работы-с-кэшем">Пример работы с кэшем</a></li>
  <li><a href="#установка">Установка</a></li>
  <li><a href="#поддержка-и-обратная-связь">Поддержка и обратная связь</a></li>
</ul>

<h2 id="описание">Описание</h2>
<p><strong>Apifly</strong> — это лёгкая и гибкая библиотека для организации клиент-серверного взаимодействия, поддерживающая удалённые вызовы процедур (RPC) и обмен состоянием. Она упрощает создание API, предоставляет встроенные возможности для кэширования, использования guard-функций, наблюдателей (watchers) и фильтров. Apifly помогает синхронизировать состояние между клиентом и сервером с минимальными усилиями и строгой типизацией.</p>

<h2 id="быстрый-старт">Быстрый старт</h2>

<h3 id="1-определение-состояния-и-процедур">1. Определение состояния и процедур</h3>
<p>Для начала необходимо определить тип состояния и процедур, которые будут использоваться в вашем приложении.</p>

```ts
import { ApiflyDefinition } from "@vseplet/apifly/types";

export type MyApiflyDefinition = ApiflyDefinition<
  {
    counter: number;
    message: string;
    user: {
      tg_id: string;
    };
  },
  {
    incrementCounter: {
      args: [number];
      returns: string;
    };
    resetCounter: {
      args: [];
      returns: string;
    };
    getMessage: {
      args: [];
      returns: string;
    };
  },
  {
    userId: string;
  }
>;
```

<h3 id="2-настройка-сервера">2. Настройка сервера</h3>
<p>Пример настройки сервера на базе фреймворка <strong>Hono</strong> и использования Apifly для управления состоянием:</p>

```ts
import apifly from "https://raw.githubusercontent.com/vseplet/apifly/artpani/cache/source/mod.ts";
import type { ApiflyDefinition } from "https://raw.githubusercontent.com/vseplet/apifly/blob/artpani/cache/source/types.ts";
import { Hono } from "jsr:@hono/hono";

type MyApiflyDefinition = ApiflyDefinition<
  {
    counter: number;
    message: string;
    user: {
      tg_id: string;
    };
  },
  {
    incrementCounter: {
      args: [number];
      returns: string;
    };
    resetCounter: {
      args: [];
      returns: string;
    };
    getMessage: {
      args: [];
      returns: string;
    };
  },
  {
    userId: string;
  }
>;

let database: Record<string, {
  counter: number;
  message: string;
  user: {
    tg_id: string;
  };
}> = {};

// Функции для симуляции чтения/записи данных
async function readFromDatabase(userId: string) {
  console.log(`Reading state for userId: ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!database[userId]) {
    database[userId] = {
      counter: 0,
      message: "Initial message",
      user: { tg_id: userId },
    };
  }
  return database[userId];
}

async function writeToDatabase(userId: string, newState: any) {
  console.log(`Writing state for userId: ${userId}`);
  database[userId] = newState;
}

const apiflyManager = new apifly.manager<MyApiflyDefinition>(
  true,
  4000,
  "userId",
)
  .load(async (args) => await readFromDatabase(args.userId))
  .unload(async (args) => await writeToDatabase(args.userId, args.state))
  .procedure("incrementCounter", async (args, state) => {
    state.counter += args[0];
    return `Counter incremented by ${args[0]}, new value: ${state.counter}`;
  })
  .procedure("resetCounter", async (args, state) => {
    state.counter = 0;
    return "Counter reset to 0";
  })
  .procedure("getMessage", async (args, state) => state.message)
  .guard("counter", ({ newValue }) => newValue >= 0)
  .watcher("counter", async ({ newValue, currentValue, userId }) => {
    console.log(
      `Watcher: Counter changed from ${currentValue} to ${newValue} for user ${userId}`,
    );
  })
  .filter("message", ({ currentValue }) => !currentValue.includes("secret"));

const apiflyServer = new apifly.server<MyApiflyDefinition>(
  apiflyManager,
  "/api/apifly",
  {
    userId: "X-User-ID",
  },
);

const server = new Hono();
apiflyServer.registerRoutes(server);

console.log("Server is running");
Deno.serve(server.fetch);
```

<h3 id="3-создание-клиента">3. Создание клиента</h3>

```ts
import apifly from "@vseplet/apifly";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";

export const client = new apifly.client<MyApiflyDefinition>({
  baseURL: "адрес_сервера",
  limiter: { unlimited: true },
});
```

<h2 id="пример-работы-с-кэшем">Пример работы с кэшем</h2>

```ts
const [state, error] = await client.get();
```

<h2 id="установка">Установка</h2>
<p>Для установки используйте <strong>JSR</strong>:</p>

```sh
jsr install @vseplet/apifly
```

<h2 id="поддержка-и-обратная-связь">Поддержка и обратная связь</h2>
<p>Этот модуль находится в активной разработке, и автор будет рад любым предложениям, исправлениям и pull-request'ам.</p>
