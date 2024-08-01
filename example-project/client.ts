// deno-lint-ignore-file no-unused-vars
import apifly from "$apifly";
import type { MyApiflyDefinition } from "./MyApiflyDefinition.type.ts";

export const client = new apifly.client<MyApiflyDefinition>({
  baseURL: "http://localhost:8000/api/apifly",
  limiter: {
    unlimited: true,
  },
});

// const a1 = await client.get();
// console.log(a1);
const a2 = await client.patch({ a: { b: "Hello!" } });
console.log(a2);
// // const a3 = await client.patch({ x: { z: "Hello!" } });

// const r1 = await client.call("hi", ["world", 100]);
// const r2 = await client.call("hi2", [2000]);
// const r3 = await client.call("hi3", [2000, true, "hello"]);
// // const r4 = await client.call("hi4", [2000, true, "hello", { a: 1 }]);
