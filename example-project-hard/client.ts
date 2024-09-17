// // client.ts
import apifly from "../source/mod.ts";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";
import { client1 } from "./clients/client1.ts";
import { client2 } from "./clients/client2.ts";
// main.ts

// main.ts
function logTime(startTime: number, message: string) {
  const duration = Date.now() - startTime;
  console.log(`${message} (Duration: ${duration} ms)`);
}

async function main() {
  // Client 1: Первый GET запрос
  console.log("Client1: Первый GET запрос...");
  let startTime = Date.now();
  const [value1, err1] = await client1.get();
  logTime(startTime, "Client1: Первый GET запрос завершен");
  console.log("Client1: Начальное состояние:", value1);

  // Client 2: Первый GET запрос
  console.log("Client2: Первый GET запрос...");
  startTime = Date.now();
  const [value2, err2] = await client2.get();
  logTime(startTime, "Client2: Первый GET запрос завершен");
  console.log("Client2: Начальное состояние:", value2);

  // Client 1: Применение PATCH
  console.log("Client1: Применение PATCH...");
  startTime = Date.now();
  const patchedState1 = await client1.patch({
    message: "Hello from Client1!",
    counter: 1,
  });
  logTime(startTime, "Client1: PATCH запрос завершен");
  console.log("Client1: Состояние после PATCH:", patchedState1);

  // Client 2: Применение PATCH
  console.log("Client2: Применение PATCH...");
  startTime = Date.now();
  const patchedState2 = await client2.patch({
    message: "Hello from Client2!",
    counter: 2,
  });
  logTime(startTime, "Client2: PATCH запрос завершен");
  console.log("Client2: Состояние после PATCH:", patchedState2);

  // Client 1: Второй GET запрос
  console.log("Client1: Второй GET запрос...");
  startTime = Date.now();
  const [value3, err3] = await client1.get();
  logTime(startTime, "Client1: Второй GET запрос завершен");
  console.log("Client1: Состояние после PATCH:", value3);

  // Client 2: Второй GET запрос
  console.log("Client2: Второй GET запрос...");
  startTime = Date.now();
  const [value4, err4] = await client2.get();
  logTime(startTime, "Client2: Второй GET запрос завершен");
  console.log("Client2: Состояние после PATCH:", value4);

  // Проверяем независимость состояний для каждого пользователя

  // Ждем 6 секунд для истечения TTL кэша (установлено 5 секунд)
  console.log("Ожидание 6 секунд для истечения TTL кэша...");
  await new Promise((resolve) => setTimeout(resolve, 6000));

  // Client 1: Третий GET запрос после истечения кэша
  console.log("Client1: Третий GET запрос (после истечения кэша)...");
  startTime = Date.now();
  const [value5, err5] = await client1.get();
  logTime(startTime, "Client1: Третий GET запрос завершен");
  console.log("Client1: Состояние после истечения кэша:", value5);

  // Client 2: Третий GET запрос после истечения кэша
  console.log("Client2: Третий GET запрос (после истечения кэша)...");
  startTime = Date.now();
  const [value6, err6] = await client2.get();
  logTime(startTime, "Client2: Третий GET запрос завершен");
  console.log("Client2: Состояние после истечения кэша:", value6);

  // Проверяем время выполнения запросов и состояние, чтобы убедиться в сбросе кэша
}

main();
