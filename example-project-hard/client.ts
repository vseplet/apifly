// // client.ts
import apifly from "../source/mod.ts";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";
import { client1 } from "./clients/client1.ts";
import { client2 } from "./clients/client2.ts";
// main.ts

function logTime(startTime: number, message: string) {
  const duration = Date.now() - startTime;
  console.log(`${message} (Duration: ${duration} ms)`);
}

async function main() {
  // Клиент 1: Первый GET запрос
  console.log("Client1: First GET request...");
  let startTime = Date.now();
  const [value1, err1] = await client1.get();
  logTime(startTime, "Client1: First GET request completed");
  console.log("Client1: Initial state:", value1);

  // Клиент 2: Первый GET запрос
  console.log("Client2: First GET request...");
  startTime = Date.now();
  const [value2, err2] = await client2.get();
  logTime(startTime, "Client2: First GET request completed");
  console.log("Client2: Initial state:", value2);

  // Клиент 1: Применение PATCH
  console.log("Client1: Applying PATCH...");
  startTime = Date.now();
  const patchedState1 = await client1.patch({
    message: "Hello from Client1!",
    counter: 1,
  });
  logTime(startTime, "Client1: PATCH request completed");
  console.log("Client1: State after PATCH:", patchedState1);

  // Клиент 2: Применение PATCH
  console.log("Client2: Applying PATCH...");
  startTime = Date.now();
  const patchedState2 = await client2.patch({
    message: "Hello from Client2!",
    counter: 2,
  });
  logTime(startTime, "Client2: PATCH request completed");
  console.log("Client2: State after PATCH:", patchedState2);

  // Клиент 1: Второй GET запрос
  console.log("Client1: Second GET request...");
  startTime = Date.now();
  const [value3, err3] = await client1.get();
  logTime(startTime, "Client1: Second GET request completed");
  console.log("Client1: State after PATCH:", value3);

  // Клиент 2: Второй GET запрос
  console.log("Client2: Second GET request...");
  startTime = Date.now();
  const [value4, err4] = await client2.get();
  logTime(startTime, "Client2: Second GET request completed");
  console.log("Client2: State after PATCH:", value4);

  // Проверяем, что кэширование работает отдельно для каждого клиента
}

main();
