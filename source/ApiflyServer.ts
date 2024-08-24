// deno-lint-ignore-file no-unused-vars
import type {
  ApiflyDefinition,
  ApiflyGuards,
  ApiflyRequest,
  ApiflyResponse,
  ApiflyWatchers,
  InferStateType,
} from "$types";

/**
 * Apifly server
 */
export class ApiflyServer<
  D extends ApiflyDefinition<any, any>,
> {
  private stateLoad: (
    req: ApiflyRequest<InferStateType<D>>,
  ) => Promise<InferStateType<D>> = () => {
    throw new Error("State load not implemented");
  };
  private stateUnload: (
    state: InferStateType<D>,
    req: ApiflyRequest<InferStateType<D>>,
  ) => Promise<void> = (
    state,
  ) => {
    throw new Error("State unload not implemented");
  };
  private watchersList: ApiflyWatchers<InferStateType<D>> = {};
  private guardsList: ApiflyGuards<InferStateType<D>> = {};

  constructor() {}

  /**
   * Adds guards
   * @param guards The guards to add.
   * @returns The server instance.
   */
  guards(guards: ApiflyGuards<InferStateType<D>>): ApiflyServer<D> {
    this.guardsList = guards;
    return this;
  }

  /**
   * Adds watchers
   * @param watchers The watchers to add.
   * @returns The server instance.
   */
  watchers(watchers: ApiflyWatchers<InferStateType<D>>): ApiflyServer<D> {
    this.watchersList = watchers;
    return this;
  }

  /**
   * Adds a procedure
   * @param name The name of the procedure.
   * @param handler The handler of the procedure.
   * @returns The server instance.
   */
  procedure<N extends keyof D["rpc"]>(
    name: N,
    handler: (
      args: D["rpc"][N]["args"],
    ) => Promise<D["rpc"][N]["returns"]>,
  ): ApiflyServer<D> {
    return this;
  }

  /**
   * Loads the state
   * @param cb The callback to load the state from.
   * @returns The server instance.
   */
  load(cb: () => Promise<InferStateType<D>>): ApiflyServer<D> {
    this.stateLoad = cb;
    return this;
  }

  /**
   * Stores the state
   * @param cb The callback to store the state to.
   * @returns The server instance.
   */
  unload(cb: (state: InferStateType<D>) => Promise<void>): ApiflyServer<D> {
    this.stateUnload = cb;
    return this;
  }

  /**
   * Executes the procedures
   * @param state The state to execute the procedures on.
   * @returns The server instance.
   */
  private async executeProcedures(state: InferStateType<D>): Promise<void> {
  }

  /**
   * Handles a request
   * @param req The request to handle.
   * @returns The response to the request.
   */
  async handleRequest(
    req: ApiflyRequest<InferStateType<D>>,
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    try {
      const type = req.type;
      const state = await this.stateLoad(req);

      if (type == "get") {
      } else if (type == "patch") {
      }

      const newState = {} as InferStateType<D>;
      // load state
      // apply guards
      // store state
      await this.stateUnload(newState, req);
      // apply watchers
    } catch (e: unknown) {
    }
    // apply rpc
    throw new Error("HandleRequest not implemented");
  }

  async get() {}

  async patch() {}

  async call() {}
}
