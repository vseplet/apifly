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

  async get(): Promise<
    [ApiflyResponse<InferStateType<D>> | null, Error | null]
  > {
    console.log("Sending GET request");
    try {
      const response = await this.fetchify.post("", {
        body: JSON.stringify({
          type: "get",
        }),
      });
      const result = await response.json();
      console.log("Received GET response:", result);
      return [result, null];
    } catch (error) {
      console.error("GET request error:", error);
      return [null, error];
    }
  }

  async patch(
    patch: ApiflyPatch<InferStateType<D>>,
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    console.log("Sending PATCH request with patch:", patch);
    try {
      const response = await this.fetchify.post("", {
        body: JSON.stringify({
          type: "patch",
          patch,
        }),
      });
      const result = await response.json();
      console.log("Received PATCH response:", result);
      return result;
    } catch (error) {
      console.error("PATCH request error:", error);
      throw new Error("Patch request failed");
    }
  }

  async call<N extends keyof D["rpc"]>(
    name: N,
    args: InferRpcListArgs<D["rpc"]>[N],
  ): Promise<InferRpcListReturns<D["rpc"]>[N]> {
    console.log(
      `Sending CALL request for procedure ${String(name)} with args:`,
      args,
    );
    try {
      const response = await this.fetchify.post("", {
        body: JSON.stringify({
          type: "call",
          calls: [{ name, args }],
        }),
      });

      const result = await response.json();
      console.log(
        `Received CALL response for procedure ${String(name)}:`,
        result,
      );
      return result;
    } catch (error) {
      console.error(`CALL request error for procedure ${String(name)}:`, error);
      throw new Error(`Failed to call procedure ${String(name)}`);
    }
  }
}
