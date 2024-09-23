import { MyApiflyDefinition } from "../MyApiflyDefinition.type.ts";
import apifly from "../../source/mod.ts";

export const client1 = new apifly.client<MyApiflyDefinition>({
  // baseURL: "https://apiflyservertesting.deno.dev/api/apifly",
  baseURL: "http://localhost:8000/api/apifly",
  limiter: {
    unlimited: true,
  },
  headers: {
    "X-User-ID": "user10",
  },
});
