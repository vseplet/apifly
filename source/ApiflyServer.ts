import type {
  ApiflyDefinition,
  ApiflyGuards,
  ApiflyRequest,
  ApiflyResponse,
  ApiflyWatchers,
} from "$types";

export class ApiflyServer<S, D extends ApiflyDefinition<S>> {
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
