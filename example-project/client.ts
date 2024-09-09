// deno-lint-ignore-file no-unused-vars
import apifly from "../source/mod.ts";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";

export const client = new apifly.client<MyApiflyDefinition>({
  baseURL: "http://localhost:8000/api/apifly",
  limiter: {
    unlimited: true,
  },
});

const [value, err] = await client.get();

if (err) {
  console.error("Error fetching state:", err);
  Deno.exit(1);
} else {
  console.log("Initial state:", value);
}

const patchedValue = await client.patch({ a: { b: "Hello!" } });
console.log("Patched state:", patchedValue);

const r1 = await client.call("hi", ["world", 100]);
console.log("Procedure hi result:", r1);

const r2 = await client.call("hi2", [2000]);
console.log("Procedure hi2 result:", r2);

const r3 = await client.call("hi3", [2000, true, "hello"]);
console.log("Procedure hi3 result:", r3);
