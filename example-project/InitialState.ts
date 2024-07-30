import type { ApiflyDefinition } from "$types";

export const InitialState = {
  "a": {
    "b": "hello",
    "c": {
      "d": true,
    },
  },
};

export const definition: ApiflyDefinition<typeof InitialState> = {
  state: InitialState,
  methods: {
    "hello": { args: [], return: "string" },
  },
};
