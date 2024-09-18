// // client.ts
// import { client1 } from "./clients/client1.ts";
// import { client2 } from "./clients/client2.ts";

// function logTime(startTime: number, message: string) {
//   const duration = Date.now() - startTime;
//   console.log(`${message} (Duration: ${duration} ms)`);
// }

// async function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function main() {
//   // Client 1: Получение начального состояния
//   console.log("Client1: Получение начального состояния...");
//   let startTime = Date.now();
//   const [value1, err1] = await client1.get();
//   logTime(startTime, "Client1: Начальный GET запрос завершен");
//   console.log("Client1: Начальное состояние:", value1);

//   // Client 1: Установка сообщения с 'secret' для тестирования фильтра
//   console.log("Client1: Установка сообщения с 'secret'...");
//   startTime = Date.now();
//   const patchedState1 = await client1.patch({
//     message: "This is a secret message!",
//   });
//   logTime(startTime, "Client1: PATCH запрос завершен");
//   console.log("Client1: Состояние после PATCH:", patchedState1);

//   // Client 1: Получение состояния для проверки фильтра
//   console.log(
//     "Client1: Получение состояния после установки 'secret' сообщения...",
//   );
//   startTime = Date.now();
//   const [value2, err2] = await client1.get();
//   logTime(startTime, "Client1: GET запрос завершен");
//   console.log("Client1: Состояние после фильтрации сообщения:", value2);

//   // Ожидаем 3 секунды и снова делаем GET запрос, кэш должен быть активен
//   console.log("Client1: Ожидание 3 секунды перед следующим GET запросом...");
//   await sleep(3000);
//   startTime = Date.now();
//   const [cachedValue, errCached] = await client1.get();
//   logTime(startTime, "Client1: GET запрос из кэша завершен");
//   console.log("Client1: Состояние из кэша:", cachedValue);

//   // Ожидаем еще 3 секунды, чтобы кэш истек
//   console.log("Client1: Ожидание 3 секунды для истечения кэша...");
//   await sleep(3000);
//   startTime = Date.now();
//   const [expiredCacheValue, errExpired] = await client1.get();
//   logTime(startTime, "Client1: GET запрос после истечения кэша завершен");
//   console.log("Client1: Состояние после истечения кэша:", expiredCacheValue);

//   // Client 2: Попытка установить отрицательное значение счетчика для тестирования guard
//   console.log("Client2: Попытка установить отрицательное значение счетчика...");
//   startTime = Date.now();
//   const patchedState2 = await client2.patch({
//     counter: -5,
//   });
//   logTime(startTime, "Client2: PATCH запрос завершен");
//   console.log("Client2: Состояние после PATCH:", patchedState2);

//   // Client 2: Получение состояния для проверки guard
//   console.log(
//     "Client2: Получение состояния после попытки установить отрицательный счетчик...",
//   );
//   startTime = Date.now();
//   const [value3, err3] = await client2.get();
//   logTime(startTime, "Client2: GET запрос завершен");
//   console.log("Client2: Состояние после проверки guard:", value3);

//   // Client 1: Увеличение счетчика для проверки watcher
//   console.log("Client1: Увеличение счетчика на 3...");
//   startTime = Date.now();
//   const [result1, error1] = await client1.call("incrementCounter", [3]);
//   logTime(startTime, "Client1: вызов incrementCounter завершен");
//   console.log("Client1: Результат incrementCounter:", result1);

//   // Client 2: Увеличение счетчика для проверки watcher
//   console.log("Client2: Увеличение счетчика на 2...");
//   startTime = Date.now();
//   const [result2, error2] = await client2.call("incrementCounter", [2]);
//   logTime(startTime, "Client2: вызов incrementCounter завершен");
//   console.log("Client2: Результат incrementCounter:", result2);

//   // Client 1: Получение финального состояния
//   console.log("Client1: Получение финального состояния...");
//   startTime = Date.now();
//   const [value10, err10] = await client1.get();
//   logTime(startTime, "Client1: Финального GET запрос завершен");
//   console.log("Client1: Финальное состояние:", value10);
// }

// main();

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
