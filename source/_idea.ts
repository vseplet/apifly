// deno-lint-ignore-file no-unused-vars require-await

import type { ApiflyGuards, ApiflyPatch, ApiflyWatchers } from "$types";

// definition
const string = (v: string) => v;
const number = (v: number) => v;
const boolean = (v: boolean) => v;

const StateDefinition = {
  "a": {
    "b": string(""),
    "c": {
      "d": boolean(true),
    },
  },
};

// backend
const guards: ApiflyGuards<typeof StateDefinition> = {
  "a": {
    "b": (state, value, update) => update === "1",
    "c": {
      "d": (state, value, update) => update === true,
    },
  },
};

const handlers: ApiflyWatchers<typeof StateDefinition> = {
  "a": {
    "b": async (state: typeof StateDefinition) => {},
    "c": {
      "d": async (state: typeof StateDefinition) => {},
    },
  },
};

const update = async (
  guards: ApiflyGuards<typeof StateDefinition>,
  handlers: ApiflyWatchers<typeof StateDefinition>,
  state: typeof StateDefinition,
  update: Partial<ApiflyPatch<typeof StateDefinition>>,
) => {
  return state;
};

// frontend
const get = async (): Promise<Partial<typeof StateDefinition>> => {
  return {};
};

const put = async (
  state: Partial<ApiflyPatch<typeof StateDefinition>>,
): Promise<void> => {
  return;
};

const api = { get, put };

const a = await api.get();
const b = await api.put({
  "a": {
    "b": "hello",
  },
});
