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

export type ApiflyDefinition<T> = {
  state: T;
  methods: { [name: string]: { args: any[]; return: any } };
};
