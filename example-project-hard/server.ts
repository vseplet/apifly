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
  // Имитируем чтение данных из базы
  console.log("Reading from DB:", database.state);
  return database.state;
}

async function writeToDatabase(newState: any) {
  // Имитируем запись данных в базу
  console.log("Writing to DB:", newState);
  database.state = newState;
}

// Инициализируем сервер Apifly
const apiflyServer = new apifly.manager<MyApiflyDefinition>()
  .load(async (args) => {
    // Чтение состояния из "базы данных"
    const state = await readFromDatabase();
    return [state, null];
  })
  .unload(async (args) => {
    // Запись состояния в "базу данных" после изменений
    await writeToDatabase(args.state);
    return null;
  })
  .guards({
    counter: (args) => {
      // Guard: Counter must not go below zero
      return args.newValue >= 0;
    },
  })
  .filters({
    message: (args) => {
      // Filter: Only show the message if it starts with "Hello"
      return args.currentValue.startsWith("Hello");
    },
  })
  .watchers({
    counter: async (args) => {
      console.log(`Counter watcher triggered: ${args.currentValue}`);
    },
    message: async (args) => {
      console.log(`Message watcher triggered: ${args.currentValue}`);
    },
  })
  .procedure("incrementCounter", async (args, state) => {
    const [amount] = args;
    state.counter += amount; // Изменение состояния
    //TODO: подумать над гуард-защитой от мутабеллных процедур
    return `Counter incremented by ${amount}, new value: ${state.counter}`;
  })
  .procedure("resetCounter", async (args, state) => {
    state.counter = 0; // Сброс состояния
    return "Counter reset to 0";
  })
  .procedure("getMessage", async (args, state) => {
    return state.message; // Возвращение сообщения
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
