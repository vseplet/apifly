import type {
  ApiflyDefinition,
  ApiflyGuards,
  ApiflyRequest,
  ApiflyResponse,
  ApiflyWatchers,
} from "$types";

export class ApiflyServer<T, D extends ApiflyDefinition<T>> {
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
    req: ApiflyRequest<D["state"]>,
  ): Promise<ApiflyResponse<T>> {
    throw new Error("Not implemented");
  }
}
