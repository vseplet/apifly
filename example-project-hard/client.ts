// client.ts
import { client1 } from "./clients/client1.ts";

function logTime(startTime: number, message: string) {
  const duration = Date.now() - startTime;
  console.log(`${message} (Duration: ${duration} ms)`);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Client 1: Получение начального состояния
  console.log("Client1: Получение начального состояния...");
  let startTime = Date.now();
  const [value1, err1] = await client1.get();
  logTime(startTime, "Client1: Начальный GET запрос завершен");
  console.log("Client1: Начальное состояние:", value1);

  // Client 1: Изменение состояния через PATCH
  console.log("Client1: Изменение состояния через PATCH...");
  startTime = Date.now();
  const patchedState = await client1.patch({
    message: "Updated message!",
  });
  logTime(startTime, "Client1: PATCH запрос завершен");
  console.log("Client1: Состояние после PATCH:", patchedState);

  // Client 1: Немедленный GET запрос после PATCH
  console.log("Client1: Получение состояния сразу после PATCH...");
  startTime = Date.now();
  const [valueAfterPatch, errAfterPatch] = await client1.get();
  logTime(startTime, "Client1: GET запрос после PATCH завершен");
  console.log("Client1: Состояние после PATCH:", valueAfterPatch);

  // Ожидаем 6 секунд, чтобы проверить истечение кэша
  console.log("Client1: Ожидание 6 секунд для проверки кэша...");
  await sleep(6000);

  // Client 1: GET запрос после истечения кэша
  console.log("Client1: GET запрос после истечения кэша...");
  startTime = Date.now();
  const [valueAfterCacheExpiry, errAfterCacheExpiry] = await client1.get();
  logTime(startTime, "Client1: GET запрос после истечения кэша завершен");
  console.log(
    "Client1: Состояние после истечения кэша:",
    valueAfterCacheExpiry,
  );
}

main();
