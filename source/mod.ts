import type { ApiflyGuards, ApiflyPatch, ApiflyWatchers } from "$types";
import fetchify from "@vseplet/fetchify";
// import { Fetchify } from "https://jsr.io/@vseplet/fetchify/0.3.17/source/fetchify.ts";
// import { IFetchifyConfig } from "https://jsr.io/@vseplet/fetchify/0.3.17/source/types.ts";

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
  private fetchify: {}; // late

  constructor(private state: T, fetchifyConfig?: {}) {
    this.fetchify = fetchify.create(fetchifyConfig);
  }

  async get(): Promise<Partial<T>> {
    throw new Error("Not implemented");
    // this.fetchify.get("/state");
  }

  async patch(patch: ApiflyPatch<T>) {
    throw new Error("Not implemented");
    // this.fetchify.patch("/state", patch);
  }

  async call(method: string, args: any[]) {
    throw new Error("Not implemented");
    // this.fetchify.post("/call");
  }
}
