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

export type ApiflyDefinition<
  T,
> = {
  state: T;
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
  returns?: {
    [key: string]: any;
  };
  error: string | null;
};
