// deno-lint-ignore-file require-await no-explicit-any
import type {
  ApiflyDefinition,
  ApiflyPatch,
  ApiflyResponse,
  InferRpcListArgs,
  InferRpcListReturns,
  InferStateType,
} from "$types";
import fetchify from "@vseplet/fetchify";
import type { Fetchify } from "@vseplet/fetchify/Fetchify";
import type { IFetchifyConfig } from "@vseplet/fetchify/types";

export class ApiflyClient<
  D extends ApiflyDefinition<any, any>,
> {
  private fetchify: Fetchify;

  constructor(
    fetchifyConfig?: IFetchifyConfig,
  ) {
    this.fetchify = fetchify.create(fetchifyConfig);
  }

  async get(): Promise<ApiflyResponse<InferStateType<D>>> {
    throw new Error("Not implemented");
    // this.fetchify.get("/state");
  }

  async patch(
    patch: ApiflyPatch<InferStateType<D>>,
  ): Promise<ApiflyResponse<InferStateType<D>>> {
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
