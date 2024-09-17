// // server.ts
// import { Hono } from "@hono/hono";
// import apifly from "../source/mod.ts";
// import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";

// // Наш "эмулятор базы данных"
// let database = {
//   state: {
//     counter: 0,
//     message: "Initial message",
//     user: {
//       tg_id: "123456789",
//     },
//   },
// };

// // Функции эмуляции чтения и записи "базы данных"
// async function readFromDatabase() {
//   console.log("Reading from DB:", database.state);
//   // Добавляем задержку для имитации реального доступа к данным
//   await new Promise((resolve) => setTimeout(resolve, 2000)); // Задержка 2 секунды
//   return database.state;
// }

// async function writeToDatabase(newState: any) {
//   console.log("Writing to DB:", newState);
//   database.state = newState;
// }

// // Инициализируем ApiflyManager
// const apiflyManager = new apifly.manager<MyApiflyDefinition>(
//   false, // Включаем кэширование
//   5000, // TTL кэша в 5 секунд
//   "user.tg_id", // Указываем поле из состояния для cacheKey
// )
//   .load(async (args) => {
//     const state = await readFromDatabase();
//     return [state, null];
//   })
//   .unload(async (args) => {
//     await writeToDatabase(args.state);
//     return null;
//   })
//   .procedure("incrementCounter", async (args, state) => {
//     const [amount] = args;
//     state.counter += amount;
//     return `Counter incremented by ${amount}, new value: ${state.counter}`;
//   })
//   .procedure("resetCounter", async (args, state) => {
//     state.counter = 0;
//     return "Counter reset to 0";
//   })
//   .procedure("getMessage", async (args, state) => {
//     return state.message;
//   });

// // Инициализируем ApiflyServer и указываем базовый путь "/api"
// const apiflyServer = new apifly.server<MyApiflyDefinition>(
//   apiflyManager,
//   "/api/apifly", // Базовый путь
//   (c) => {
//     // Извлекаем заголовки
//     const userId = c.req.header("X-User-ID") || "default";

//     // Возвращаем extra данные
//     return {
//       userId,
//       // Другие данные по необходимости
//     } as MyApiflyDefinition["extra"];
//   },
// );

// // Настройка маршрутов Hono
// const server = new Hono();

// // Регистрируем маршруты ApiflyServer на сервере Hono
// apiflyServer.registerRoutes(server);

// // Запуск сервера
// console.log("Server is running on http://localhost:8000");
// Deno.serve(server.fetch);
