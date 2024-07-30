import { ApiflyClient } from "$apifly";
import { InitialState } from "./InitialState.ts";

const client = new ApiflyClient(InitialState);

await client.get();
await client.patch({ "a": { "b": "1" } });
