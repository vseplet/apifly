// ApiflyManager.ts
// deno-lint-ignore-file no-unused-vars no-explicit-any
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
  GetValueByKey,
  InferStateType,
  NestedKeyOf,
} from "$types";

// Импортируем Deno Cache API
// Убедитесь, что ваше окружение поддерживает Deno Cache API
const cache = await caches.open("apifly-cache");

export class ApiflyManager<D extends ApiflyDefinition<any, any>> {
  private cacheEnabled: boolean;
  private cacheTTL: number; // В миллисекундах
  private cacheKeyField?: NestedKeyOf<InferStateType<D>>;

  constructor(
    cacheEnabled: boolean = false,
    cacheTTL: number = 60000,
    cacheKeyField?: NestedKeyOf<InferStateType<D>>,
  ) {
    this.cacheEnabled = cacheEnabled;
    this.cacheTTL = cacheTTL;
    this.cacheKeyField = cacheKeyField;
    console.log(
      `Caching is ${
        this.cacheEnabled ? "enabled" : "disabled"
      }, TTL: ${this.cacheTTL}ms`,
    );
    if (this.cacheKeyField) {
      console.log(`Cache key field set to: ${this.cacheKeyField}`);
    }
  }

  /**
   * Устанавливает TTL (время жизни) кэша в миллисекундах
   * @param ttl Время в миллисекундах после которого кэш должен истечь
   */
  setCacheTTL(ttl: number) {
    this.cacheTTL = ttl;
    console.log(`Cache TTL set to ${ttl}ms`);
    return this;
  }

  /**
   * Проверяет, включено ли кэширование
   */
  isCacheEnabled(): boolean {
    return this.cacheEnabled;
  }

  /**
   * Устанавливает включение или отключение кэширования
   * @param enabled Булевое значение для включения или отключения кэширования
   */
  setCacheEnabled(enabled: boolean) {
    this.cacheEnabled = enabled;
    console.log(`Caching is ${this.cacheEnabled ? "enabled" : "disabled"}`);
    return this;
  }

  /**
   * Добавляет guards
   * @param guards Guards для добавления
   * @returns Инстанс ApiflyManager
   */
  guards(
    guards: ApiflyGuards<D["extra"], InferStateType<D>>,
  ): ApiflyManager<D> {
    console.log("Adding guards:", guards);
    this.guardsList = guards;
    return this;
  }

  /**
   * Добавляет watchers
   * @param watchers Watchers для добавления
   * @returns Инстанс ApiflyManager
   */
  watchers(
    watchers: ApiflyWatchers<D["extra"], InferStateType<D>>,
  ): ApiflyManager<D> {
    console.log("Adding watchers:", watchers);
    this.watchersList = watchers;
    return this;
  }

  /**
   * Добавляет filters
   * @param filters Filters для добавления
   * @returns Инстанс ApiflyManager
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
  ) => Promise<Error | null> = () => {
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
   * Добавляет guard
   */
  guard<K extends NestedKeyOf<InferStateType<D>>>(
    key: K,
    predicate: ApiflyGuard<
      D["extra"],
      GetValueByKey<InferStateType<D>, K>,
      InferStateType<D>
    >,
  ) {
    console.log(`Adding guard for key: ${String(key)}`);
    const keyParts = key.toString().split(".");
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
   * Добавляет watcher
   */
  watcher<K extends NestedKeyOf<InferStateType<D>>>(
    key: K,
    callback: ApiflyWatcher<
      D["extra"],
      GetValueByKey<InferStateType<D>, K>,
      InferStateType<D>
    >,
  ) {
    console.log(`Adding watcher for key: ${String(key)}`);
    const keyParts = key.toString().split(".");
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
   * Добавляет filter
   */
  filter<K extends NestedKeyOf<InferStateType<D>>>(
    key: K,
    predicate: ApiflyFilter<
      D["extra"],
      GetValueByKey<InferStateType<D>, K>,
      InferStateType<D>
    >,
  ) {
    console.log(`Adding filter for key: ${String(key)}`);
    const keyParts = key.toString().split(".");
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
   * Добавляет процедуру
   */
  procedure<N extends keyof D["rpc"]>(
    name: N,
    handler: (
      args: D["rpc"][N]["args"],
      state: InferStateType<D>,
    ) => Promise<D["rpc"][N]["returns"]>,
  ): ApiflyManager<D> {
    console.log(`Adding procedure: ${String(name)}`);
    this.procedures[name] = async (args: any, state: InferStateType<D>) => {
      return await handler(args, state);
    };
    return this;
  }

  /**
   * Загружает состояние
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
   * Сохраняет состояние
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

  /**
   * Получает значение cacheKey из состояния
   */
  private getCacheKeyFromExtra(extra: D["extra"]): string {
    if (!this.cacheKeyField) {
      return "default";
    }

    const cacheKeyValue = extra[this.cacheKeyField as keyof D["extra"]];
    if (cacheKeyValue === undefined || cacheKeyValue === null) {
      console.warn(
        `Cache key value is undefined or null for field: ${this.cacheKeyField}`,
      );
      return "default";
    }
    return String(cacheKeyValue);
  }

  // /**
  //  * Рекурсивно получает значение по пути ключей
  //  */
  // private getValueByPath<T, K extends string>(
  //   obj: T,
  //   path: K,
  // ): GetValueByKey<T, K> | undefined {
  //   const parts = path.split(".");
  //   let current: any = obj;
  //   for (const part of parts) {
  //     if (current && typeof current === "object" && part in current) {
  //       current = current[part];
  //     } else {
  //       return undefined;
  //     }
  //   }
  //   return current;
  // }

  /**
   * Получает состояние, используя кэширование при необходимости
   */

  async get(extra: D["extra"]): Promise<[InferStateType<D>, Error | null]> {
    console.log("Fetching current state from stateLoad...");

    const cacheKey = this.getCacheKeyFromExtra(extra);
    const cacheUrl = new URL(
      `https://cache.example.com/${encodeURIComponent(cacheKey)}`,
    );

    if (this.cacheEnabled) {
      const cachedResponse = await cache.match(cacheUrl);
      if (cachedResponse) {
        console.log(`✅ Cache HIT for key: ${cacheKey}`);
        const cachedData = await cachedResponse.json();
        return [cachedData as InferStateType<D>, null];
      } else {
        console.log(`❌ Cache MISS for key: ${cacheKey}`);
      }
    }

    // Если нет кэша или кэширование отключено
    const [state, error] = await this.stateLoad({
      req: { type: "get" },
      ...extra,
    });

    if (error) {
      return [state, error];
    }

    // Кэшируем состояние
    if (this.cacheEnabled) {
      const response = new Response(JSON.stringify(state), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `max-age=${this.cacheTTL / 1000}`,
        },
      });
      await cache.put(cacheUrl, response);
      console.log(`🔐 State cached with key: ${cacheKey}`);
    }

    return [state, error];
  }

  /**
   * Применяет патч к состоянию и обновляет кэш
   */
  async patch(
    patch: ApiflyPatch<InferStateType<D>>,
    extra: D["extra"],
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    console.log("Applying patch:", patch);
    const [currentState, loadError] = await this.stateLoad({
      req: { type: "get" },
      ...extra,
    });
    if (loadError) {
      console.error("Error loading state:", loadError);
      return { state: {}, error: loadError };
    }

    const oldCacheKey = this.getCacheKeyFromExtra(extra);

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

    // Применяем патч к текущему состоянию
    const newState = { ...currentState, ...patch };

    const newCacheKey = this.getCacheKeyFromExtra(extra);

    console.log("Applying filters...");
    const filteredState = this.applyFilters(newState, extra);

    console.log("Saving new state...");
    const unloadError = await this.stateUnload({
      state: newState,
      req: { type: "patch", patch },
      ...extra,
    });
    if (unloadError) {
      console.error("Error saving state:", unloadError);
      return { state: currentState, error: unloadError };
    }

    // Сбрасываем старый кэш
    if (this.cacheEnabled) {
      const oldCacheUrl = new URL(
        `https://cache.example.com/${encodeURIComponent(oldCacheKey)}`,
      );
      await cache.delete(oldCacheUrl);
      console.log(`Cache cleared for old key: ${oldCacheKey}`);
      if (newCacheKey !== oldCacheKey) {
        const newCacheUrl = new URL(
          `https://cache.example.com/${encodeURIComponent(newCacheKey)}`,
        );
        await cache.delete(newCacheUrl);
        console.log(`Cache cleared for new key: ${newCacheKey}`);
      }
    }

    console.log("Running watchers...");
    const updatedFields = this.getUpdatedFields(currentState, newState);
    await this.applyWatchers(updatedFields, newState, extra);

    return { state: newState, error: null };
  }

  /**
   * Выполняет процедуру и обновляет кэш
   */
  async call<N extends keyof D["rpc"]>(
    name: N,
    args: D["rpc"][N]["args"],
    extra: D["extra"],
  ): Promise<[D["rpc"][N]["returns"], Error | null]> {
    console.log(`Calling procedure: ${String(name)} with args:`, args);

    const [currentState, loadError] = await this.get({});
    if (loadError) {
      throw new Error("Failed to load state");
    }

    const oldCacheKey = this.getCacheKeyFromExtra(extra);

    const procedure = this.procedures[name];
    if (!procedure) {
      throw new Error(`Procedure ${String(name)} not found`);
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

    const newCacheKey = this.getCacheKeyFromExtra(extra);

    // Сбрасываем кэш
    if (this.cacheEnabled) {
      const oldCacheUrl = new URL(
        `https://cache.example.com/${encodeURIComponent(oldCacheKey)}`,
      );
      await cache.delete(oldCacheUrl);
      console.log(`Cache cleared for old key: ${oldCacheKey}`);
      if (newCacheKey !== oldCacheKey) {
        const newCacheUrl = new URL(
          `https://cache.example.com/${encodeURIComponent(newCacheKey)}`,
        );
        await cache.delete(newCacheUrl);
        console.log(`Cache cleared for new key: ${newCacheKey}`);
      }
    }

    console.log("Running watchers...");
    const updatedFields = this.getUpdatedFields(previousState, newState);
    await this.applyWatchers(updatedFields, newState, {});

    return [result, null];
  }

  /**
   * Обрабатывает запрос (get, patch, call)
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
            extra,
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
   * Применяет guards к патчу
   */
  private applyGuards(
    patch: ApiflyPatch<InferStateType<D>>,
    currentState: InferStateType<D>,
    extra?: D["extra"],
  ): [boolean, Error | null] {
    console.log("Checking guards...");
    for (const key in patch) {
      const guard = this.getNestedValue(this.guardsList, key);
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

  /**
   * Применяет filters к состоянию
   */
  private applyFilters(
    state: InferStateType<D>,
    extra?: D["extra"],
  ): InferStateType<D> {
    console.log("Applying filters to state...");
    const filteredState = { ...state };

    for (const key in state) {
      const filter = this.getNestedValue(this.filtersList, key);
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

  /**
   * Применяет watchers к обновлённым полям
   */
  private async applyWatchers(
    updatedFields: ApiflyPatch<InferStateType<D>>,
    newState: InferStateType<D>,
    extra: D["extra"],
  ): Promise<void> {
    console.log("Applying watchers...");
    for (const key in updatedFields) {
      const watcher = this.getNestedValue(this.watchersList, key);
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

  /**
   * Вспомогательный метод для получения значения из вложенных объектов по пути ключей
   */
  private getNestedValue(obj: any, path: string): any {
    const keys = path.split(".");
    let current = obj;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    return current;
  }
}
