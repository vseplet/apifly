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

/**
 * @description ApiflyClient is a client for Apifly.
 * @example
 * ```ts
 * const client = new ApiflyClient<ApiflyDefinition>();
 * ```
 */
export class ApiflyClient<
  D extends ApiflyDefinition<any, any>,
> {
  private fetchify: Fetchify;

  constructor(
    fetchifyConfig?: IFetchifyConfig,
  ) {
    this.fetchify = fetchify.create(fetchifyConfig);
  }

  // @ts-ignore
  async get(): Promise<ApiflyResponse<InferStateType<D>>> {
    // @ts-ignore
    return await this.fetchify.post("", {
      body: JSON.stringify({
        type: "get",
      }),
    });
  }

  async patch(
    patch: ApiflyPatch<InferStateType<D>>,
    // @ts-ignore
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    // @ts-ignore
    return await this.fetchify.post("", {
      body: JSON.stringify({
        type: "patch",
        patch,
      }),
    });
  }

  async call<N extends keyof D["rpc"]>(
    name: N,
    args: InferRpcListArgs<D["rpc"]>[N], // Выводим тип аргументов
  ): Promise<InferRpcListReturns<D["rpc"]>[N]> { // Выводим тип возвращаемого значения
    throw new Error("Not implemented");
    this.fetchify.post("/call");
  }

  // async call<N extends keyof D["procedures"]>(
  //   name: D["procedures"][N]["name"],
  //   args: D["procedures"][N]["args"],
  // ) {
  //   throw new Error("Not implemented");
  //   // this.fetchify.post("/call");
  // }
}
