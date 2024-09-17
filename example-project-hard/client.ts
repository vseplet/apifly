// // client.ts
import apifly from "../source/mod.ts";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";

// export const client = new apifly.client<MyApiflyDefinition>({
//   baseURL: "http://localhost:8000/api/apifly",
//   limiter: {
//     unlimited: true,
//   },
// });

// // Тест кэширования с использованием patch и call

// console.log("First GET request (should take 2 seconds)...");
// const [value1, err1] = await client.get();
// console.log("Initial state:", value1);

// if (err1) {
//   console.error("Error in GET request:", err1);
// }

// // Применение patch (это должно обновить состояние и сбросить кэш)
// console.log("Applying PATCH to update message and counter...");
// const patchedState = await client.patch({
//   message: "Hello, Apifly!",
//   counter: 5,
// });
// console.log("State after PATCH:", patchedState);

// // Вызов get сразу после patch (должен вернуть обновлённое состояние из кэша)
// console.log("Second GET request (should be instant, from cache)...");
// const [value2, err2] = await client.get();
// console.log("State from cache:", value2);

// if (err2) {
//   console.error("Error in GET request:", err2);
// }

// // Вызов call для incrementCounter (это должно обновить состояние и сбросить кэш)
// console.log("Calling incrementCounter...");
// try {
//   const incrementResult = await client.call("incrementCounter", [10]);
//   console.log("Result of incrementCounter:", incrementResult);
// } catch (incrementError) {
//   console.error("Error in incrementCounter:", incrementError);
// }

// // Вызов get после call (должен вернуть обновлённое состояние из кэша)
// console.log("Third GET request (should be instant, from cache)...");
// const [value3, err3] = await client.get();
// console.log("State from cache after call:", value3);

// if (err3) {
//   console.error("Error in GET request:", err3);
// }

// // Ждём 6 секунд для того, чтобы кэш истёк
// console.log("Waiting 6 seconds for cache to expire...");
// await new Promise((resolve) => setTimeout(resolve, 6000));

// // Вызов get после истечения TTL (должен загрузить состояние из базы)
// console.log("Fourth GET request (cache expired, should take 2 seconds)...");
// const [value4, err4] = await client.get();
// console.log("State after cache expired:", value4);

// if (err4) {
//   console.error("Error in GET request:", err4);
// }

// // Вызов resetCounter (сброс счетчика и обновление состояния)
// console.log("Calling resetCounter...");

// const resetResult = await client.call("resetCounter", []);

// // Проверка состояния после сброса
// console.log("Fifth GET request (should be instant, from cache)...");
// const [value5, err5] = await client.get();
// console.log("State after resetCounter:", value5);

// if (err5) {
//   console.error("Error in GET request:", err5);
// }

export const client = new apifly.client<MyApiflyDefinition>({
  baseURL: "https://light-starfish-82.deno.dev/api/apifly",
  limiter: {
    unlimited: true,
  },
  headers: {
    // Здесь вы можете динамически добавлять необходимые заголовки
    // Например, получаемые из переменных среды или другого места
    "X-User-ID": "123456789",
  },
});

function logTime(startTime: number, message: string) {
  const duration = Date.now() - startTime;
  console.log(`${message} (Duration: ${duration} ms)`);
}

async function main() {
  // Первый GET запрос
  console.log("First GET request (should take ~2000 ms if cache miss)...");
  let startTime = Date.now();
  const [value1, err1] = await client.get();
  logTime(startTime, "First GET request completed");
  console.log("Initial state:", value1);

  if (err1) {
    console.error("Error in GET request:", err1);
  }

  // Применение PATCH
  console.log("Applying PATCH to update message and counter...");
  startTime = Date.now();
  const patchedState = await client.patch({
    message: "Hello, Apifly!",
    counter: 5,
  });
  logTime(startTime, "PATCH request completed");
  console.log("State after PATCH:", patchedState);

  // Второй GET запрос
  console.log("Second GET request (should be fast if cache hit)...");
  startTime = Date.now();
  const [value2, err2] = await client.get();
  logTime(startTime, "Second GET request completed");
  console.log("State from cache:", value2);

  if (err2) {
    console.error("Error in GET request:", err2);
  }

  // Вызов процедуры incrementCounter
  console.log("Calling incrementCounter...");
  startTime = Date.now();
  try {
    const result = await client.call("incrementCounter", [10]);
    logTime(startTime, "incrementCounter call completed");
    console.log("Result of incrementCounter:", result);
  } catch (error) {
    console.error("Error in incrementCounter:", error);
  }

  // Третий GET запрос
  console.log("Third GET request (should be fast if cache hit)...");
  startTime = Date.now();
  const [value3, err3] = await client.get();
  logTime(startTime, "Third GET request completed");
  console.log("State after incrementCounter:", value3);

  if (err3) {
    console.error("Error in GET request:", err3);
  }

  // Ждём 6 секунд для истечения кэша
  console.log("Waiting 6 seconds for cache to expire...");
  await new Promise((resolve) => setTimeout(resolve, 6000));

  // Четвертый GET запрос после истечения TTL
  console.log("Fourth GET request (should take ~2000 ms if cache expired)...");
  startTime = Date.now();
  const [value4, err4] = await client.get();
  logTime(startTime, "Fourth GET request completed");
  console.log("State after cache expired:", value4);

  if (err4) {
    console.error("Error in GET request:", err4);
  }

  // Вызов процедуры resetCounter
  console.log("Calling resetCounter...");
  startTime = Date.now();
  try {
    const result = await client.call("resetCounter", []);
    logTime(startTime, "resetCounter call completed");
    console.log("Result of resetCounter:", result);
  } catch (error) {
    console.error("Error in resetCounter:", error);
  }

  // Пятый GET запрос
  console.log("Fifth GET request (should be fast if cache hit)...");
  startTime = Date.now();
  const [value5, err5] = await client.get();
  logTime(startTime, "Fifth GET request completed");
  console.log("State after resetCounter:", value5);

  if (err5) {
    console.error("Error in GET request:", err5);
  }
}

main();
