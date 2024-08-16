type Role = string; // Его потом переопределим

type RecursiveGuards<T, D = T> = {
  [K in keyof T]?: T[K] extends object ? RecursiveGuards<T[K], D>
    : (
      role: Role,
      currentValue: T[K],
      newValue: T[K],
      state: D,
    ) => boolean;
};

/**
 * Defines an Apifly guard
 * @param T The state type
 * @returns The Apifly guard
 */
export type ApiflyGuards<T> = RecursiveGuards<T>;

type RecursiveWatchers<T, D = T> = {
  [K in keyof T]?: T[K] extends object ? RecursiveWatchers<T[K], D>
    : (
      state: D,
    ) => Promise<void>;
};

/**
 * Defines an Apifly watcher
 * @param T The state type
 * @returns The Apifly watcher
 */
export type ApiflyWatchers<T> = RecursiveWatchers<T>;

type RecursiveHandlers<T, D = T> = {
  [K in keyof T]?: T[K] extends object ? RecursiveHandlers<T[K], D>
    : (
      oldV: T[K],
      newV: T[K],
      state: D,
    ) => Promise<void>;
};

/**
 * Defines an Apifly post-update handler
 * @param T The state type
 * @returns The Apifly post-update handler
 */
export type ApiflyHandlers<T> = RecursiveHandlers<T>;

/**
 * Defines an Apifly patch
 * @param T The state type
 * @returns The Apifly patch
 */
export type ApiflyPatch<T> = {
  [K in keyof T]?: T[K] extends object ? ApiflyPatch<T[K]>
    : T[K];
};

/**
 * Defines an Apifly state part
 * @param T The state type
 * @returns The Apifly state part
 */
export type ApiflyStatePart<T> = {
  [K in keyof T]?: T[K] extends object ? ApiflyPatch<T[K]>
    : T[K];
};

/**
 * Infer the state type
 * @param T The Apifly definition
 * @returns The state type
 */
export type InferStateType<T> = T extends ApiflyDefinition<infer A, infer B> ? A
  : never;

/**
 * Defines an Apifly RPC definition
 * @param A The arguments type
 * @param B The returns type
 * @returns The Apifly RPC definition
 */
export type ApiflyRpcDefinition<A extends any[], B> = {
  args: A;
  returns: B;
};

/**
 * Defines an Apifly RPC list definition
 * @returns The Apifly RPC list definition
 */
export type ApiflyRpcListDefinition = {
  [key: string]: ApiflyRpcDefinition<any, any>;
};

/**
 * Infer the RPC arguments
 * @param T The RPC definition
 * @returns The RPC arguments
 */
export type InferRpcArgs<T> = T extends ApiflyRpcDefinition<infer A, any> ? A
  : never;

/**
 * Infer the RPC returns
 * @param T The RPC definition
 * @returns The RPC returns
 */
export type InferRpcReturns<T> = T extends ApiflyRpcDefinition<any, infer B> ? B
  : never;

/**
 * Infer the RPC list arguments
 * @param T The RPC list definition
 * @returns The RPC list arguments
 */
export type InferRpcListArgs<T extends ApiflyRpcListDefinition> = {
  [K in keyof T]: InferRpcArgs<T[K]>;
};

/**
 * Infer the RPC list returns
 * @param T The RPC list definition
 * @returns The RPC list returns
 */
export type InferRpcListReturns<T extends ApiflyRpcListDefinition> = {
  [K in keyof T]: InferRpcReturns<T[K]>;
};

/**
 * Defines an Apifly definition
 * @param S The state type
 * @param R The RPC list definition
 * @param E The extra type
 * @returns The Apifly definition
 */
export type ApiflyDefinition<
  S,
  R extends ApiflyRpcListDefinition,
  E = {},
> = {
  state: S;
  rpc: R;
  extra: E;
  guards?: ApiflyGuards<S>;
  handlers?: ApiflyHandlers<S>;
  watchers?: ApiflyWatchers<S>;
};

/**
 * Defines an Apifly request
 * @param T The state type
 * @returns The Apifly request
 */
export type ApiflyRequest<T> = {
  type: "get" | "patch";
  calls?: {
    name: string;
    args: any[];
  }[];
  patch?: ApiflyPatch<T>;
};

/**
 * Defines an Apifly response
 * @param T The state type
 * @returns The Apifly response
 */
export type ApiflyResponse<T> = {
  state: ApiflyStatePart<T>;
  stateHash?: string;
  error: string | null;
  returns?: {
    [key: string]: any;
  };
};
