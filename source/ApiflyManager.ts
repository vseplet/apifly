// ApiflyManager.ts
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
  CacheEntry,
  GetValueByKey,
  InferStateType,
  NestedKeyOf,
} from "$types";

// Импортируем Deno Cache API
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
   * @returns Текущий экземпляр ApiflyManager для цепочного вызова методов
   */
  setCacheTTL(ttl: number): this {
    this.cacheTTL = ttl;
    console.log(`Cache TTL set to ${ttl}ms`);
    return this;
  }

  /**
   * Проверяет, включено ли кэширование
   * @returns true, если кэширование включено; иначе false
   */
  isCacheEnabled(): boolean {
    return this.cacheEnabled;
  }

  /**
   * Включает или отключает кэширование
   * @param enabled Булевое значение для включения или отключения кэширования
   * @returns Текущий экземпляр ApiflyManager для цепочного вызова методов
   */
  setCacheEnabled(enabled: boolean): this {
    this.cacheEnabled = enabled;
    console.log(`Caching is ${this.cacheEnabled ? "enabled" : "disabled"}`);
    return this;
  }

  /**
   * Добавляет guards
   * @param guards Guards для добавления
   * @returns Текущий экземпляр ApiflyManager для цепочного вызова методов
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
   * @returns Текущий экземпляр ApiflyManager для цепочного вызова методов
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
   * @returns Текущий экземпляр ApiflyManager для цепочного вызова методов
   */
  filters(
    filters: ApiflyFilters<D["extra"], InferStateType<D>>,
  ): ApiflyManager<D> {
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
   * @param key Ключ, к которому применяется guard
   * @param predicate Функция-предикат для проверки значения
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
    return this;
  }

  /**
   * Добавляет watcher
   * @param key Ключ, к которому применяется watcher
   * @param callback Функция обратного вызова при изменении значения
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
    return this;
  }

  /**
   * Добавляет filter
   * @param key Ключ, к которому применяется filter
   * @param predicate Функция-предикат для фильтрации значения
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
    return this;
  }

  /**
   * Добавляет процедуру
   * @param name Имя процедуры
   * @param handler Функция-обработчик процедуры
   * @returns Текущий экземпляр ApiflyManager для цепочного вызова методов
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
   * Устанавливает функцию загрузки состояния
   * @param cb Функция загрузки состояния
   * @returns Текущий экземпляр ApiflyManager для цепочного вызова методов
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
   * Устанавливает функцию сохранения состояния
   * @param cb Функция сохранения состояния
   * @returns Текущий экземпляр ApiflyManager для цепочного вызова методов
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
   * Получает значение ключа кэша из extra
   * @param extra Дополнительные данные
   * @returns Значение ключа кэша в виде строки
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

  /**
   * Получает состояние, используя кэширование при необходимости
   * @param extra Дополнительные данные
   * @returns Кортеж [состояние, ошибка]
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
        const cachedEntry: CacheEntry<InferStateType<D>> = await cachedResponse
          .json();
        const now = Date.now();
        if (now - cachedEntry.timestamp < this.cacheTTL) {
          console.log(`✅ Cache HIT for key: ${cacheKey}`);
          return [cachedEntry.data, null];
        } else {
          console.log(`⏰ Cache EXPIRED for key: ${cacheKey}`);
          await cache.delete(cacheUrl);
        }
      } else {
        console.log(`❌ Cache MISS for key: ${cacheKey}`);
      }
    } else {
      console.log("Caching is disabled; loading state from stateLoad.");
    }

    const [state, error] = await this.stateLoad({
      req: { type: "get" },
      ...extra,
    });

    if (error) {
      return [state, error];
    }

    if (this.cacheEnabled) {
      await this.updateCache(cacheKey, state);
    }

    return [state, error];
  }

  /**
   * Применяет патч к состоянию и обновляет кэш
   * @param patch Патч для применения к состоянию
   * @param extra Дополнительные данные
   * @returns Ответ ApiflyResponse с новым состоянием или ошибкой
   */
  async patch(
    patch: ApiflyPatch<InferStateType<D>>,
    extra: D["extra"],
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    console.log("Applying patch:", patch);

    const [currentState, loadError] = await this.get(extra);
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

    const newState = { ...currentState, ...patch };

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

    const cacheKey = this.getCacheKeyFromExtra(extra);
    if (this.cacheEnabled) {
      await this.updateCache(cacheKey, newState);
    }

    console.log("Running watchers...");
    const updatedFields = this.getUpdatedFields(currentState, newState);
    await this.applyWatchers(updatedFields, newState, extra);

    return { state: newState, error: null };
  }

  /**
   * Выполняет процедуру и обновляет кэш
   * @param name Имя процедуры
   * @param args Аргументы процедуры
   * @param extra Дополнительные данные
   * @returns Кортеж [результат процедуры, ошибка]
   */
  async call<N extends keyof D["rpc"]>(
    name: N,
    args: D["rpc"][N]["args"],
    extra: D["extra"],
  ): Promise<[D["rpc"][N]["returns"], Error | null]> {
    console.log(`Calling procedure: ${String(name)} with args:`, args);

    const [currentState, loadError] = await this.get(extra);
    if (loadError) {
      throw new Error("Failed to load state");
    }

    const procedure = this.procedures[name];
    if (!procedure) {
      throw new Error(`Procedure ${String(name)} not found`);
    }

    const previousState = { ...currentState };

    const result = await procedure(args, currentState);

    const newState = currentState; // Предполагается, что процедура изменяет состояние напрямую

    console.log("Applying filters...");
    const filteredState = this.applyFilters(newState, extra);

    console.log("Saving new state...");
    const unloadError = await this.stateUnload({
      state: newState,
      req: { type: "call", calls: [{ name, args }] },
      ...extra,
    });
    if (unloadError) {
      console.error("Error saving state:", unloadError);
      return [result, unloadError];
    }

    const cacheKey = this.getCacheKeyFromExtra(extra);
    if (this.cacheEnabled) {
      await this.updateCache(cacheKey, newState);
    }

    console.log("Running watchers...");
    const updatedFields = this.getUpdatedFields(previousState, newState);
    await this.applyWatchers(updatedFields, newState, extra);

    return [result, null];
  }

  /**
   * Обрабатывает запрос (get, patch, call)
   * @param req Запрос ApiflyRequest
   * @param extra Дополнительные данные
   * @returns Ответ ApiflyResponse с состоянием и ошибкой, если есть
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

  /**
   * Получает обновленные поля состояния
   * @param previousState Предыдущее состояние
   * @param newState Новое состояние
   * @returns Патч с обновленными полями
   */
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
   * @param patch Патч для применения
   * @param currentState Текущее состояние
   * @param extra Дополнительные данные
   * @returns Кортеж [можно ли продолжить, ошибка]
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
   * @param state Текущее состояние
   * @param extra Дополнительные данные
   * @returns Отфильтрованное состояние
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
   * Применяет watchers к обновленным полям
   * @param updatedFields Обновленные поля
   * @param newState Новое состояние
   * @param extra Дополнительные данные
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
   * Получает значение из вложенного объекта по пути
   * @param obj Объект
   * @param path Путь к значению
   * @returns Значение или undefined
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

  /**
   * Обновляет кэш с новым состоянием
   * @param cacheKey Ключ кэша
   * @param state Новое состояние
   */
  private async updateCache(
    cacheKey: string,
    state: InferStateType<D>,
  ) {
    if (this.cacheEnabled) {
      const cacheUrl = new URL(
        `https://cache.example.com/${encodeURIComponent(cacheKey)}`,
      );

      const cacheEntry: CacheEntry<InferStateType<D>> = {
        data: state,
        timestamp: Date.now(),
      };

      const response = new Response(JSON.stringify(cacheEntry), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      await cache.put(cacheUrl, response);
      console.log(`🔄 Cache updated for key: ${cacheKey}`);
    }
  }

  /**
   * Инвалидирует (сбрасывает) кэш для заданного ключа
   * @param extra Дополнительные данные для вычисления cacheKey
   */
  async invalidateCache(extra: D["extra"]): Promise<void> {
    if (this.cacheEnabled) {
      const cacheKey = this.getCacheKeyFromExtra(extra);
      const cacheUrl = new URL(
        `https://cache.example.com/${encodeURIComponent(cacheKey)}`,
      );
      await cache.delete(cacheUrl);
      console.log(`🗑️ Cache invalidated for key: ${cacheKey}`);
    } else {
      console.log("Caching is disabled; nothing to invalidate.");
    }
  }
}
