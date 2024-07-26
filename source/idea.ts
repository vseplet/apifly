// deno-lint-ignore-file no-unused-vars require-await
type RecursiveGuards<T> = {
  [K in keyof T]?: T[K] extends object ? RecursiveGuards<T[K]>
    : (
      state: typeof StateDefinition,
      value: T[K],
      update: T[K],
    ) => boolean;
};

type RecursiveHandlers<T> = {
  [K in keyof T]?: T[K] extends object ? RecursiveHandlers<T[K]>
    : (
      state: typeof StateDefinition,
    ) => Promise<void>;
};

type StateUpdate<T> = {
  [K in keyof T]?: T[K] extends object ? StateUpdate<T[K]>
    : T[K];
};

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
const guards: RecursiveGuards<typeof StateDefinition> = {
  "a": {
    "b": (state, value, update) => update === "1",
    "c": {
      "d": (state, value, update) => update === true,
    },
  },
};

const handlers: RecursiveHandlers<typeof StateDefinition> = {
  "a": {
    "b": async (state: typeof StateDefinition) => {},
    "c": {
      "d": async (state: typeof StateDefinition) => {},
    },
  },
};

const update = async (
  guards: RecursiveGuards<typeof StateDefinition>,
  handlers: RecursiveHandlers<typeof StateDefinition>,
  state: typeof StateDefinition,
  update: Partial<StateUpdate<typeof StateDefinition>>,
) => {
  return state;
};

// frontend
const get = async (): Promise<Partial<typeof StateDefinition>> => {
  return {};
};

const put = async (
  state: Partial<StateUpdate<typeof StateDefinition>>,
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
