// deno-lint-ignore-file
import apifly from "../source/mod.ts";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";
import { Hono } from "@hono/hono";

// Наш "эмулятор базы данных"
let database = {
  state: {
    counter: 0,
    message: "Initial message",
  },
};

// Функции эмуляции чтения и записи "базы данных"
async function readFromDatabase() {
  console.log("Reading from DB:", database.state);
  // Добавляем задержку для имитации реального доступа к данным
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Задержка 2 секунды
  return database.state;
}

async function writeToDatabase(newState: any) {
  console.log("Writing to DB:", newState);
  database.state = newState;
}

// Инициализируем сервер Apifly с кэшированием
const apiflyServer = new apifly.manager<MyApiflyDefinition>(true) // Включаем кэширование
  .setCacheTTL(5000) // Устанавливаем TTL кэша в 5 секунд
  .load(async (args) => {
    const state = await readFromDatabase();
    return [state, null];
  })
  .unload(async (args) => {
    await writeToDatabase(args.state);
    return null;
  })
  .procedure("incrementCounter", async (args, state) => {
    const [amount] = args;
    state.counter += amount;
    return `Counter incremented by ${amount}, new value: ${state.counter}`;
  })
  .procedure("resetCounter", async (args, state) => {
    state.counter = 0;
    return "Counter reset to 0";
  })
  .procedure("getMessage", async (args, state) => {
    return state.message;
  });

// Настройка маршрутов Hono
const server = new Hono();
const api = new Hono();

api.post("/apifly", async (c) => {
  const jsonBody = await c.req.json();
  const response = await apiflyServer.handleRequest(jsonBody, {});
  return c.json(response);
});

server.route("/api", api);

// Запуск сервера
Deno.serve(server.fetch);
