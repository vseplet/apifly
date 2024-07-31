import type {
  ApiflyDefinition,
  ApiflyGuards,
  ApiflyRequest,
  ApiflyResponse,
  ApiflyWatchers,
} from "$types";

export class ApiflyServer<
  D extends ApiflyDefinition<any, any>,
> {
  constructor() {
  }

  guards(guards: ApiflyGuards<D["state"]>) {
    return this;
  }

  watchers(watchers: ApiflyWatchers<D["state"]>) {
    return this;
  }

  procedure<N extends keyof D["rpc"]>(
    name: N,
    handler: (
      args: D["rpc"][N]["args"],
    ) => Promise<D["rpc"][N]["returns"]>,
  ) {
    return this;
  }

  async handleRequest(
    req: ApiflyRequest<D["state"]>,
  ): Promise<ApiflyResponse<D["state"]>> {
    throw new Error("Not implemented");
  }
}
