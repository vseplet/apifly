// deno-lint-ignore-file require-await
import type { ApiflyDefinition, ApiflyPatch, ApiflyResponse } from "$types";
import fetchify from "@vseplet/fetchify";
import type { Fetchify } from "@vseplet/fetchify/Fetchify";
import type { IFetchifyConfig } from "@vseplet/fetchify/types";

export class ApiflyClient<
  T,
  D extends ApiflyDefinition<T>,
> {
  private fetchify: Fetchify;

  constructor(
    private definition: D,
    fetchifyConfig?: IFetchifyConfig,
  ) {
    this.fetchify = fetchify.create(fetchifyConfig);
  }

  async get(): Promise<ApiflyResponse<T>> {
    throw new Error("Not implemented");
    // this.fetchify.get("/state");
  }

  async patch(
    patch: ApiflyPatch<T>,
  ): Promise<ApiflyResponse<T>> {
    throw new Error("Not implemented");
    // this.fetchify.patch("/state", patch);
  }

  // async call<N extends keyof D["procedures"]>(
  //   name: D["procedures"][N]["name"],
  //   args: D["procedures"][N]["args"],
  // ) {
  //   throw new Error("Not implemented");
  //   // this.fetchify.post("/call");
  // }
}
