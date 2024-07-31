import type {
  ApiflyDefinition,
  ApiflyGuards,
  ApiflyRequest,
  ApiflyResponse,
  ApiflyRpcListDefinition,
  ApiflyWatchers,
} from "$types";

export class ApiflyServer<
  S,
  R extends ApiflyRpcListDefinition,
  D extends ApiflyDefinition<S, R>,
> {
  constructor(private definition: D) {
  }

  guards(guards: ApiflyGuards<D["state"]>) {
    return this;
  }

  watchers(watchers: ApiflyWatchers<D["state"]>) {
    return this;
  }

  procedures(procedures: { [name: string]: (...args: any[]) => Promise<any> }) {
    return this;
  }

  async handleRequest(
    req: ApiflyRequest<S>,
  ): Promise<ApiflyResponse<S>> {
    throw new Error("Not implemented");
  }
}
