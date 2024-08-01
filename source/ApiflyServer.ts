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
  private stateLoad: () => Promise<InferStateType<D>> = () => {
    throw new Error("State load not implemented");
  };
  private stateStore: (state: InferStateType<D>) => Promise<void> = (state) => {
    throw new Error("State store not implemented");
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
  store(cb: (state: InferStateType<D>) => Promise<void>): ApiflyServer<D> {
    this.stateStore = cb;
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
   * Loads the state
   * @returns The state.
   */
  private async getState() {
    return await this.stateLoad();
  }

  /**
   * Stores the state
   * @param state The state to store.
   * @returns The server instance.
   */
  private async putState(state: InferStateType<D>): Promise<void> {
    return await this.stateStore(state);
  }

  /**
   * Handles a request
   * @param req The request to handle.
   * @returns The response to the request.
   */
  async handleRequest(
    req: ApiflyRequest<InferStateType<D>>,
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    const newState = {} as InferStateType<D>;
    // load state
    const state = await this.stateLoad();
    // apply guards
    // store state
    await this.stateStore(newState);
    // apply watchers

    // apply rpc
    throw new Error("HandleRequest not implemented");
  }
}
