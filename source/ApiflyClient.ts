// deno-lint-ignore-file require-await
import type {
  ApiflyDefinition,
  ApiflyPatch,
  ApiflyResponse,
  ApiflyRpcListDefinition,
  InferRpcListArgs,
  InferRpcListReturns,
} from "$types";
import fetchify from "@vseplet/fetchify";
import type { Fetchify } from "@vseplet/fetchify/Fetchify";
import type { IFetchifyConfig } from "@vseplet/fetchify/types";

export class ApiflyClient<
  T,
  R extends ApiflyRpcListDefinition,
  D extends ApiflyDefinition<T, R>,
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

  async call<N extends keyof D["rpc"]>(
    name: N,
    args: InferRpcListArgs<D["rpc"]>[N], // Выводим тип аргументов
  ): Promise<InferRpcListReturns<D["rpc"]>[N]> { // Выводим тип возвращаемого значения
    throw new Error("Not implemented");
    // this.fetchify.post("/call");
  }

  // async call<N extends keyof D["procedures"]>(
  //   name: D["procedures"][N]["name"],
  //   args: D["procedures"][N]["args"],
  // ) {
  //   throw new Error("Not implemented");
  //   // this.fetchify.post("/call");
  // }
}
