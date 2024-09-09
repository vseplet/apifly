// deno-lint-ignore-file no-unused-vars
import apifly from "../source/mod.ts";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";

export const client = new apifly.client<MyApiflyDefinition>({
  baseURL: "http://localhost:8000/api/apifly",
  limiter: {
    unlimited: true,
  },
});

// Получение начального состояния
const [value, err] = await client.get();

if (err) {
  console.error("Error fetching state:", err);
  Deno.exit(1);
} else {
  console.log("Initial state:", value);
}

// Применение patch к состоянию
const patchedMessage = await client.patch({
  message: "Hello, World!",
  counter: 10,
});
console.log("Patched state:", patchedMessage);

// Вызов incrementCounter
const incrementResult = await client.call("incrementCounter", [-50]);
console.log("Increment result:", incrementResult);

// Вызов resetCounter
const resetResult = await client.call("resetCounter", []);
console.log("Reset result:", resetResult);

// Вызов getMessage
const message = await client.call("getMessage", []);
console.log("Message:", message);
