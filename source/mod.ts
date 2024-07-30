import type { ApiflyGuards, ApiflyPatch, ApiflyWatchers } from "$types";
import fetchify from "@vseplet/fetchify";
import type { Fetchify } from "@vseplet/fetchify/Fetchify";
import type { IFetchifyConfig } from "@vseplet/fetchify/types";

export class ApiflyServer<T> {
  constructor(private state: T) {
  }

  guards(guards: ApiflyGuards<T>) {
    return this;
  }

  watchers(watchers: ApiflyWatchers<T>) {
    return this;
  }

  update(patch: ApiflyPatch<T>, callback?: (state: T) => Promise<boolean>): T {
    throw new Error("Not implemented");
  }
}

export class ApiflyClient<T> {
  private fetchify: Fetchify; // late

  constructor(private state: T, fetchifyConfig?: IFetchifyConfig) {
    this.fetchify = fetchify.create(fetchifyConfig);
  }

  async get(): Promise<Partial<T>> {
    throw new Error("Not implemented");
    this.fetchify.get("/state");
  }

  async patch(patch: ApiflyPatch<T>) {
    throw new Error("Not implemented");
    this.fetchify.patch("/state", patch);
  }

  async call(method: string, args: any[]) {
    throw new Error("Not implemented");
    this.fetchify.post("/call");
  }
}
