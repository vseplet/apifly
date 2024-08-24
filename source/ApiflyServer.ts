// deno-lint-ignore-file no-unused-vars
import type {
  ApiflyDefinition,
  ApiflyFilters,
  ApiflyGuards,
  ApiflyRequest,
  ApiflyResponse,
  ApiflyWatchers,
  InferStateType,
} from "$types";

/**
 * Apifly server
 */
export class ApiflyServer<D extends ApiflyDefinition<any, any>> {
  private stateLoad: (
    args: {
      req: ApiflyRequest<InferStateType<D>>;
    } & D["extra"],
  ) => Promise<[InferStateType<D>, Error | null]> = () => {
    throw new Error("State load not implemented");
  };

  private stateUnload: (
    args: {
      state: InferStateType<D>;
      req: ApiflyRequest<InferStateType<D>>;
    } & D["extra"],
  ) => Promise<Error | null> = (state) => {
    throw new Error("State unload not implemented");
  };

  private watchersList: ApiflyWatchers<D["extra"], InferStateType<D>> = {};
  private guardsList: ApiflyGuards<D["extra"], InferStateType<D>> = {};
  private filtersList: ApiflyFilters<D["extra"], InferStateType<D>> = {};

  constructor() {}

  /**
   * Adds guards
   * @param guards The guards to add.
   * @returns The server instance.
   */
  guards(guards: ApiflyGuards<D["extra"], InferStateType<D>>): ApiflyServer<D> {
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
  ): ApiflyServer<D> {
    this.watchersList = watchers;
    return this;
  }

  filters(filters: ApiflyFilters<D["extra"], InferStateType<D>>) {
    this.filtersList = filters;
    return this;
  }

  guard() {}
  watcher() {}
  filter() {}

  /**
   * Adds a procedure
   * @param name The name of the procedure.
   * @param handler The handler of the procedure.
   * @returns The server instance.
   */
  procedure<N extends keyof D["rpc"]>(
    name: N,
    handler: (args: D["rpc"][N]["args"]) => Promise<D["rpc"][N]["returns"]>,
  ): ApiflyServer<D> {
    return this;
  }

  /**
   * Loads the state
   * @param cb The callback to load the state from.
   * @returns The server instance.
   */
  load(
    cb: (
      args: {
        req: ApiflyRequest<InferStateType<D>>;
      } & D["extra"],
    ) => Promise<[InferStateType<D>, Error | null]>,
  ): ApiflyServer<D> {
    this.stateLoad = cb;
    return this;
  }

  /**
   * Stores the state
   * @param cb The callback to store the state to.
   * @returns The server instance.
   */
  unload(
    cb: (
      args: {
        state: InferStateType<D>;
        req: ApiflyRequest<InferStateType<D>>;
      } & D["extra"],
    ) => Promise<Error | null>,
  ): ApiflyServer<D> {
    this.stateUnload = cb;
    return this;
  }

  /**
   * Executes the procedures
   * @param state The state to execute the procedures on.
   * @returns The server instance.
   */
  private async executeProcedures(state: InferStateType<D>): Promise<void> {}

  /**
   * Handles a request
   * @param req The request to handle.
   * @returns The response to the request.
   */
  async handleRequest(
    req: ApiflyRequest<InferStateType<D>>,
    extra: D["extra"],
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    try {
      const type = req.type;
      const [state, stateLoadError] = await this.stateLoad({ req, extra }); // тут формируется Extra

      if (stateLoadError) {
        return {
          state: {},
          error: stateLoadError.message,
        };
      }

      if (type == "get") {
        // вызываем фильтры, фильтруем полученный стейт и возвращаем его
        return {
          state,
          error: "",
        };
      } else if (type == "patch") {
        const path = req.patch;
        // вызываем гуарды, проверяем что можно сохранить и собираем новый стейт, если все гуарды вернули тру
        const newState = {} as InferStateType<D>;

        const stateUnloadError = await this.stateUnload({
          state: newState,
          req,
          extra,
        });

        if (stateUnloadError) {
          return {
            state: {},
            error: stateUnloadError.message,
          };
        }

        // вызываем вотчеры, если стейт сохранился
      }

      // а тут дергаем все RPC
    } catch (e: unknown) {
      return {
        state: {},
        error: (e as Error).message,
      };
    }

    return {
      state: {},
      error: "",
    };
    // apply rpc
    // throw new Error("HandleRequest not implemented");
  }

  async get(extra: D["extra"]): Promise<[InferStateType<D>, Error | null]> {
    throw new Error("not implemented!");
  }

  async patch(patch: any, extra: D["extra"]): Promise<Error | null> {
    throw new Error("not implemented!");
  }

  async call() {}
}
