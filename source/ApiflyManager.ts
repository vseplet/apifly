// deno-lint-ignore-file no-unused-vars
import type {
  ApiflyDefinition,
  ApiflyFilter,
  ApiflyFilters,
  ApiflyGuard,
  ApiflyGuards,
  ApiflyPatch,
  ApiflyRequest,
  ApiflyResponse,
  ApiflyWatcher,
  ApiflyWatchers,
  InferStateType,
} from "$types";

export class ApiflyManager<D extends ApiflyDefinition<any, any>> {
  private stateCache: InferStateType<D> | null = null;
  private cacheTTL: number | null = null;
  private cacheTimestamp: number | null = null;
  private useCache: boolean = false;

  constructor(useCache: boolean = false) {
    this.useCache = useCache;
    console.log(`Caching is ${this.useCache ? "enabled" : "disabled"}`);
  }

  /**
   * Set the TTL (Time-to-live) for the cache in milliseconds
   * @param ttl The time in milliseconds after which the cache should expire
   */
  setCacheTTL(ttl: number) {
    this.cacheTTL = ttl;
    console.log(`Cache TTL set to ${ttl}ms`);
    return this;
  }

  /**
   * Check if the cache is valid (i.e., not expired)
   */
  private isCacheValid(): boolean {
    if (!this.useCache) {
      return false;
    }

    if (!this.stateCache || !this.cacheTTL || !this.cacheTimestamp) {
      return false;
    }
    const currentTime = Date.now();
    return currentTime - this.cacheTimestamp < this.cacheTTL;
  }

  /**
   * Clear the cache manually
   */
  clearCache() {
    this.stateCache = null;
    this.cacheTimestamp = null;
    console.log("Cache cleared");
  }

  /**
   * Adds guards
   * @param guards The guards to add.
   * @returns The server instance.
   */
  guards(
    guards: ApiflyGuards<D["extra"], InferStateType<D>>,
  ): ApiflyManager<D> {
    console.log("Adding guards:", guards);
    this.guardsList = guards;
    return this;
  }

  /**
   * Adds watchers
   * @param watchers The watchers to add.
   * @returns The server instance.
   */
  watchers(
    watchers: ApiflyWatchers<D["extra"], InferStateType<D>>,
  ): ApiflyManager<D> {
    console.log("Adding watchers:", watchers);
    this.watchersList = watchers;
    return this;
  }

  /**
   * Adds filters
   * @param filters The filters to add.
   * @returns The server instance.
   */
  filters(filters: ApiflyFilters<D["extra"], InferStateType<D>>) {
    console.log("Adding filters:", filters);
    this.filtersList = filters;
    return this;
  }

  private stateLoad: (
    args: {
      req: ApiflyRequest<InferStateType<D>>;
    } & D["extra"],
  ) => Promise<[InferStateType<D>, Error | null]> = () => {
    console.error("State load not implemented");
    throw new Error("State load not implemented");
  };

  private stateUnload: (
    args: {
      state: InferStateType<D>;
      req: ApiflyRequest<InferStateType<D>>;
    } & D["extra"],
  ) => Promise<Error | null> = (state) => {
    console.error("State unload not implemented");
    throw new Error("State unload not implemented");
  };

  private watchersList: ApiflyWatchers<D["extra"], InferStateType<D>> = {};
  private procedures: Partial<
    Record<
      keyof D["rpc"],
      (args: any, state: InferStateType<D>) => Promise<any>
    >
  > = {};
  private guardsList: ApiflyGuards<D["extra"], InferStateType<D>> = {};
  private filtersList: ApiflyFilters<D["extra"], InferStateType<D>> = {};

  /**
   * Adds a guard
   */
  guard<K extends keyof InferStateType<D>>(
    key: K,
    predicate: ApiflyGuard<D["extra"], InferStateType<D>[K], InferStateType<D>>,
  ) {
    console.log(`Adding guard for key: ${String(key)}`);
    const keyParts = key.toString().split(".") as (keyof InferStateType<D>)[];

    let target = this.guardsList as any;

    for (let i = 0; i < keyParts.length - 1; i++) {
      const part = keyParts[i];
      if (!target[part]) {
        target[part] = {};
      }
      target = target[part];
    }

    target[keyParts[keyParts.length - 1]] = predicate;
  }

  /**
   * Adds a watcher
   */
  watcher<K extends keyof InferStateType<D>>(
    key: K,
    callback: ApiflyWatcher<
      D["extra"],
      InferStateType<D>[K],
      InferStateType<D>
    >,
  ) {
    console.log(`Adding watcher for key: ${String(key)}`);
    const keyParts = key.toString().split(".") as (keyof InferStateType<D>)[];

    let target = this.watchersList as any;

    for (let i = 0; i < keyParts.length - 1; i++) {
      const part = keyParts[i];
      if (!target[part]) {
        target[part] = {};
      }
      target = target[part];
    }

    target[keyParts[keyParts.length - 1]] = callback;
  }

  /**
   * Adds a filter
   */
  filter<K extends keyof InferStateType<D>>(
    key: K,
    predicate: ApiflyFilter<
      D["extra"],
      InferStateType<D>[K],
      InferStateType<D>
    >,
  ) {
    console.log(`Adding filter for key: ${String(key)}`);
    const keyParts = key.toString().split(".") as (keyof InferStateType<D>)[];

    let target = this.filtersList as any;

    for (let i = 0; i < keyParts.length - 1; i++) {
      const part = keyParts[i];
      if (!target[part]) {
        target[part] = {};
      }
      target = target[part];
    }

    target[keyParts[keyParts.length - 1]] = predicate;
  }

  /**
   * Adds a procedure
   */
  procedure<N extends keyof D["rpc"]>(
    name: N,
    handler: (
      args: D["rpc"][N]["args"],
      state: InferStateType<D>,
    ) => Promise<D["rpc"][N]["returns"]>,
  ): ApiflyManager<D> {
    console.log(`Adding procedure: ${String(name)}`);
    this.procedures[name] = async (args: any) => {
      const [state, error] = await this.get({});
      if (error) {
        throw new Error("Failed to load state");
      }
      return await handler(args, state);
    };
    return this;
  }

  /**
   * Loads the state
   */
  load(
    cb: (
      args: { req: ApiflyRequest<InferStateType<D>> } & D["extra"],
    ) => Promise<[InferStateType<D>, Error | null]>,
  ): ApiflyManager<D> {
    console.log("Loading state...");
    this.stateLoad = cb;
    return this;
  }

  /**
   * Stores the state
   */
  unload(
    cb: (
      args: {
        state: InferStateType<D>;
        req: ApiflyRequest<InferStateType<D>>;
      } & D["extra"],
    ) => Promise<Error | null>,
  ): ApiflyManager<D> {
    console.log("Unloading state...");
    this.stateUnload = cb;
    return this;
  }

  private getUpdatedFields(
    previousState: InferStateType<D>,
    newState: InferStateType<D>,
  ): ApiflyPatch<InferStateType<D>> {
    const updatedFields: ApiflyPatch<InferStateType<D>> = {};

    for (const key in newState) {
      if (newState[key] !== previousState[key]) {
        updatedFields[key] = newState[key];
      }
    }

    return updatedFields;
  }

  /**
   * Executes a procedure (RPC call)
   */
  async call<N extends keyof D["rpc"]>(
    name: N,
    args: D["rpc"][N]["args"],
  ): Promise<[D["rpc"][N]["returns"], Error | null]> {
    console.log(`Calling procedure: ${String(name)} with args:`, args);
    try {
      const procedure = this.procedures[name];
      if (!procedure) {
        throw new Error(`Procedure ${String(name)} not found`);
      }

      const [currentState, loadError] = await this.get({});
      if (loadError) {
        throw new Error("Failed to load state");
      }

      const previousState = { ...currentState };

      const result = await procedure(args, currentState);

      console.log("Applying filters...");
      const newState = this.applyFilters(currentState, {});

      console.log("Saving new state...");
      const unloadError = await this.stateUnload({
        state: newState,
        req: { type: "call", calls: [{ name, args }] },
        extra: {},
      });
      if (unloadError) {
        console.error("Error saving state:", unloadError);
        return [result, unloadError];
      }

      console.log("Running watchers...");
      const updatedFields = this.getUpdatedFields(previousState, newState);
      await this.applyWatchers(updatedFields, newState, {});

      return [result, null];
    } catch (error) {
      console.error(`Error in procedure ${String(name)}:`, error);
      return [null as any, error];
    }
  }

  /**
   * Handles a request (get, patch, call)
   */
  async handleRequest(
    req: ApiflyRequest<InferStateType<D>>,
    extra: D["extra"],
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    console.log("Handling request:", req);
    try {
      switch (req.type) {
        case "get": {
          console.log("Handling 'get' request");
          const [state, error] = await this.get(extra);
          return { state: state ?? {}, error };
        }
        case "patch": {
          console.log("Handling 'patch' request");
          const patchResponse = await this.patch(req.patch!, extra);
          return patchResponse;
        }
        case "call": {
          console.log("Handling 'call' request");
          if (!req.calls || req.calls.length === 0) {
            throw new Error("Invalid call request: missing 'calls'");
          }

          const call = req.calls[0];
          const [result, error] = await this.call(
            call.name as keyof D["rpc"],
            call.args,
          );

          const [state, stateError] = await this.get(extra);

          return {
            state: state ?? {},
            error: error || stateError,
            returns: { [call.name]: result },
          };
        }
        default:
          throw new Error("Unsupported request type");
      }
    } catch (error) {
      console.error("Error handling request:", error);
      return {
        state: {},
        error: error as Error,
      };
    }
  }

  /**
   * Fetches the state, either from cache or by calling `stateLoad`
   */
  async get(extra: D["extra"]): Promise<[InferStateType<D>, Error | null]> {
    if (this.useCache && this.isCacheValid()) {
      console.log("Returning cached state");
      return [this.stateCache as InferStateType<D>, null];
    }

    console.log("Fetching current state from stateLoad...");
    const [state, error] = await this.stateLoad({
      req: { type: "get" },
      ...extra,
    });

    if (!error) {
      this.stateCache = state; // Cache the state
      this.cacheTimestamp = Date.now();
    }

    return [state, error];
  }

  /**
   * Patches the state and updates the cache
   */
  async patch(
    patch: ApiflyPatch<InferStateType<D>>,
    extra: D["extra"],
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    console.log("Applying patch:", patch);
    const [currentState, loadError] = await this.stateLoad({
      req: { type: "get" },
      extra,
    });
    if (loadError) {
      console.error("Error loading state:", loadError);
      return { state: {}, error: loadError };
    }

    console.log("Applying guards...");
    const [canProceed, guardError] = this.applyGuards(
      patch,
      currentState,
      extra,
    );
    if (!canProceed) {
      console.error("Guard check failed:", guardError);
      return { state: currentState, error: guardError?.message! };
    }

    let newState = { ...currentState, ...patch };

    console.log("Applying filters...");
    newState = this.applyFilters(newState, extra);

    console.log("Saving new state...");
    const unloadError = await this.stateUnload({
      state: newState,
      req: { type: "patch", patch },
      extra,
    });
    if (unloadError) {
      console.error("Error saving state:", unloadError);
      return { state: currentState, error: unloadError };
    }

    console.log("Running watchers...");
    await this.applyWatchers(patch, newState, extra);

    // Update the cache
    this.stateCache = newState;
    this.cacheTimestamp = Date.now();

    return { state: newState, error: null };
  }

  private applyGuards(
    patch: ApiflyPatch<InferStateType<D>>,
    currentState: InferStateType<D>,
    extra?: D["extra"],
  ): [boolean, Error | null] {
    console.log("Checking guards...");
    for (const key in patch) {
      const guard = this.guardsList[key];
      if (typeof guard === "function") {
        const canProceed = guard({
          currentValue: currentState[key],
          newValue: patch[key],
          state: currentState,
          ...extra,
        });

        if (!canProceed) {
          console.error(`Guard failed for key: ${key}`);
          return [false, new Error(`Guard failed for key ${key}`)];
        }
      }
    }
    return [true, null];
  }

  private applyFilters(
    state: InferStateType<D>,
    extra?: D["extra"],
  ): InferStateType<D> {
    console.log("Applying filters to state...");
    const filteredState = { ...state };

    for (const key in state) {
      const filter = this.filtersList[key];
      if (typeof filter === "function") {
        const shouldKeep = filter({
          currentValue: state[key],
          state,
          ...extra,
        });

        if (!shouldKeep) {
          console.log(`Removing key from state: ${key}`);
          delete filteredState[key];
        }
      }
    }

    return filteredState;
  }

  private async applyWatchers(
    updatedFields: ApiflyPatch<InferStateType<D>>,
    newState: InferStateType<D>,
    extra: D["extra"],
  ): Promise<void> {
    console.log("Applying watchers...");
    for (const key in updatedFields) {
      const watcher = this.watchersList[key];
      if (typeof watcher === "function") {
        console.log(`Running watcher for key: ${key}`);
        await watcher({
          currentValue: newState[key],
          newValue: updatedFields[key],
          state: newState,
          ...extra,
        });
      }
    }
  }
}
