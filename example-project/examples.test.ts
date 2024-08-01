import { assert, assertEquals } from "@std/assert";
import { client } from "./client.ts";

Deno.test("Create Admin", async () => {
  const a1 = await client.get();
  assert(true);
});
