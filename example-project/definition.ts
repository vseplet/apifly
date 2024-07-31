import apifly from "$apifly";

export const definition = apifly.define({
  "a": {
    "b": "hello",
    "c": {
      "d": true,
    },
  },
}, {
  "hi": {
    "args": ["string", 100] as [string, number],
    "returns": "string",
  },
  "hi2": {
    "args": [20] as [number],
    "returns": true,
  },
  "hi3": {
    "args": [20, true, "hello"] as [number, boolean, string],
    "returns": [100, 200, 300] as [number, number, number],
  },
});
