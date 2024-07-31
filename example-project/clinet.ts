import apifly from "$apifly";
import { definition } from "./definition.ts";

const client = new apifly.client(definition);

await client.get();
await client.patch({ a: { b: "Hello!" } });

const r1 = await client.call("hi", ["world", 100]);
const r2 = await client.call("hi2", [2000]);
const r3 = await client.call("hi3", [2000, true, "hello"]);
