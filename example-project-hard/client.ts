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
});

// Тест кэширования с использованием patch и call

console.log("First GET request (should take 2 seconds)...");
const [value1, err1] = await client.get();
console.log("Initial state:", value1);

if (err1) {
  console.error("Error in GET request:", err1);
}

// Применение patch (это должно обновить состояние и сбросить кэш)
console.log("Applying PATCH to update message and counter...");
const patchedState = await client.patch({
  message: "Hello, Apifly!",
  counter: 5,
});
console.log("State after PATCH:", patchedState);

// Вызов get сразу после patch (должен вернуть обновлённое состояние из кэша)
console.log("Second GET request (should be instant, from cache)...");
const [value2, err2] = await client.get();
console.log("State from cache:", value2);

if (err2) {
  console.error("Error in GET request:", err2);
}

// Вызов call для incrementCounter (это должно обновить состояние и сбросить кэш)
console.log("Calling incrementCounter...");
try {
  const incrementResult = await client.call("incrementCounter", [10]);
  console.log("Result of incrementCounter:", incrementResult);
} catch (incrementError) {
  console.error("Error in incrementCounter:", incrementError);
}

// Вызов get после call (должен вернуть обновлённое состояние из кэша)
console.log("Third GET request (should be instant, from cache)...");
const [value3, err3] = await client.get();
console.log("State from cache after call:", value3);

if (err3) {
  console.error("Error in GET request:", err3);
}

// Ждём 6 секунд для того, чтобы кэш истёк
console.log("Waiting 6 seconds for cache to expire...");
await new Promise((resolve) => setTimeout(resolve, 6000));

// Вызов get после истечения TTL (должен загрузить состояние из базы)
console.log("Fourth GET request (cache expired, should take 2 seconds)...");
const [value4, err4] = await client.get();
console.log("State after cache expired:", value4);

if (err4) {
  console.error("Error in GET request:", err4);
}

// Вызов resetCounter (сброс счетчика и обновление состояния)
console.log("Calling resetCounter...");

const resetResult = await client.call("resetCounter", []);

// Проверка состояния после сброса
console.log("Fifth GET request (should be instant, from cache)...");
const [value5, err5] = await client.get();
console.log("State after resetCounter:", value5);

if (err5) {
  console.error("Error in GET request:", err5);
}
