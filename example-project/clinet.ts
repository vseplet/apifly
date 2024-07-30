import apifly from "$apifly";
import { definition } from "./definition.ts";

const client = new apifly.client(definition);

await client.get();
await client.patch({ a: { b: "Hello!" } });
