// server.ts
import { Hono } from "@hono/hono";
import apifly from "../source/mod.ts";
import { ApiflyDefinition } from "$types";

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

// "База данных" для хранения состояния пользователей
let database: Record<string, {
  counter: number;
  message: string;
  user: {
    tg_id: string;
  };
}> = {};

// Функции для имитации чтения/записи из базы данных
async function readFromDatabase(userId: string) {
  console.log(`Reading state for userId: ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Симуляция задержки

  if (!database[userId]) {
    database[userId] = {
      counter: 0,
      message: "Initial message",
      user: {
        tg_id: userId,
      },
    };
  }

  console.log("State:", database[userId]);
  return database[userId];
}

async function writeToDatabase(userId: string, newState: any) {
  console.log(
    `Writing state: ${JSON.stringify(newState, null, 2)} for userId: ${userId}`,
  );
  database[userId] = newState;
}

// Инициализация ApiflyManager с guards, watchers и filters
const apiflyManager = new apifly.manager<MyApiflyDefinition>(
  false, // Включаем кэширование
  5000, // TTL кэша в миллисекундах
  "userId", // Используем 'userId' из 'extra' как ключ кэша
)
  .load(async (args) => {
    const { userId } = args;
    const state = await readFromDatabase(userId);
    return [state, null];
  })
  .unload(async (args) => {
    const { userId, state } = args;
    await writeToDatabase(userId, state);
    return null;
  })
  .procedure("incrementCounter", async (args, state) => {
    console.log(`В процедуре state: ${JSON.stringify(state, null, 2)}`);
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
  })
  // Добавляем guard на 'counter', чтобы предотвратить установку отрицательных значений
  .guard("counter", ({ newValue }) => {
    return newValue >= 0;
  })
  // Добавляем watcher на 'counter', чтобы отслеживать изменения
  .watcher("counter", async ({ currentValue, newValue, userId }) => {
    console.log(
      `Watcher: Counter changed from ${currentValue} to ${newValue} for user ${userId}`,
    );
  })
  // Добавляем filter на 'message', чтобы скрыть сообщение, содержащее слово 'secret'
  .filter("message", ({ currentValue, userId }) => {
    if (currentValue.includes("secret")) {
      console.log(`Filter: Hiding 'message' for user ${userId}`);
      return false; // Удаляем поле из состояния
    }
    return true; // Оставляем поле
  });

// Инициализация ApiflyServer с маппингом заголовков
const apiflyServer = new apifly.server<MyApiflyDefinition>(
  apiflyManager,
  "/api/apifly",
  {
    userId: "X-User-ID", // Маппинг 'userId' в 'extra' на заголовок 'X-User-ID'
  },
);

// Настройка сервера Hono
const server = new Hono();

//@ts-ignore
apiflyServer.registerRoutes(server);

// Запуск сервера
console.log("Server is running on https://light-starfish-82.deno.dev");
Deno.serve(server.fetch);
