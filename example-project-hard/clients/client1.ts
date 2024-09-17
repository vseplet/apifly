import { MyApiflyDefinition } from "../MyApiflyDefinition.type.ts";
import apifly from "../../source/mod.ts";

export const client1 = new apifly.client<MyApiflyDefinition>({
  baseURL: "https://light-starfish-82.deno.dev/api/apifly",
  limiter: {
    unlimited: true,
  },
  headers: {
    "X-User-ID": "user1",
  },
});
