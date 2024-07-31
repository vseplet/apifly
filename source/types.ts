type RecursiveGuards<T, D = T> = {
  [K in keyof T]?: T[K] extends object ? RecursiveGuards<T[K], D>
    : (
      state: D,
      value: T[K],
      update: T[K],
    ) => boolean;
};

export type ApiflyGuards<T> = RecursiveGuards<T>;

type RecursiveWatchers<T, D = T> = {
  [K in keyof T]?: T[K] extends object ? RecursiveWatchers<T[K], D>
    : (
      state: D,
    ) => Promise<void>;
};

export type ApiflyWatchers<T> = RecursiveWatchers<T>;

export type ApiflyPatch<T> = {
  [K in keyof T]?: T[K] extends object ? ApiflyPatch<T[K]>
    : T[K];
};

export type ApiflyStatePart<T> = {
  [K in keyof T]?: T[K] extends object ? ApiflyPatch<T[K]>
    : T[K];
};

export type InferStateType<T> = T extends ApiflyDefinition<infer A, any> ? A
  : never;

type ApiflyRpcDefinition<A extends any[], B> = {
  args: A;
  returns: B;
};

export type ApiflyRpcListDefinition = {
  [key: string]: ApiflyRpcDefinition<any, any>;
};

export type InferRpcArgs<T> = T extends ApiflyRpcDefinition<infer A, any> ? A
  : never;

export type InferRpcReturns<T> = T extends ApiflyRpcDefinition<any, infer B> ? B
  : never;

export type InferRpcListArgs<T extends ApiflyRpcListDefinition> = {
  [K in keyof T]: InferRpcArgs<T[K]>;
};

export type InferRpcListReturns<T extends ApiflyRpcListDefinition> = {
  [K in keyof T]: InferRpcReturns<T[K]>;
};

export type ApiflyDefinition<
  S,
  R extends ApiflyRpcListDefinition,
> = {
  state: S;
  rpc: R;
};

export type ApiflyRequest<T> = {
  calls?: {
    name: string;
    args: any[];
  }[];
  patch?: ApiflyPatch<T>;
};

export type ApiflyResponse<T> = {
  state: ApiflyStatePart<T>;
  stateHash?: string;
  error: string | null;
  returns?: {
    [key: string]: any;
  };
};
