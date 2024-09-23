// ApiflyClient.ts

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
 * ApiflyClient class is responsible for handling client-side requests to
 * interact with an Apifly server. It provides methods to get the current
 * state, patch it, or call server-side procedures via RPC.
 */
export class ApiflyClient<D extends ApiflyDefinition<any, any>> {
  private fetchify: Fetchify;

  /**
   * Constructor to initialize the ApiflyClient.
   * @param {IFetchifyConfig} [fetchifyConfig] - Optional configuration for the fetchify client.
   */
  constructor(fetchifyConfig?: IFetchifyConfig) {
    this.fetchify = fetchify.create(fetchifyConfig);
  }

  /**
   * Sends a request to the server using fetchify.
   * @param {any} body - The request body to be sent to the server.
   * @returns {Promise<Response>} - The server's response.
   * @private
   */
  private async sendRequest(body: any): Promise<Response> {
    return await this.fetchify.post("", {
      body: JSON.stringify(body),
    });
  }

  /**
   * Sends a "get" request to the server to retrieve the current state.
   * @returns {Promise<[ApiflyResponse<InferStateType<D>> | null, Error | null]>} - Returns the state or an error.
   */
  async get(): Promise<
    [ApiflyResponse<InferStateType<D>> | null, Error | null]
  > {
    try {
      const response = await this.sendRequest({ type: "get" });

      const result = await response.json();
      // console.log("Received GET response:", result);
      return [result, null];
    } catch (error) {
      console.error("GET request error:", error);
      return [null, error];
    }
  }

  /**
   * Sends a "patch" request to the server to modify the current state.
   * @param {ApiflyPatch<InferStateType<D>>} patch - The patch object that contains changes to be applied.
   * @returns {Promise<ApiflyResponse<InferStateType<D>>>} - The modified state after applying the patch.
   * @throws {Error} - Throws an error if the patch request fails.
   */
  async patch(
    patch: ApiflyPatch<InferStateType<D>>,
  ): Promise<ApiflyResponse<InferStateType<D>>> {
    // console.log("Sending PATCH request with patch:", patch);
    try {
      const response = await this.sendRequest({
        type: "patch",
        patch,
      });
      const result = await response.json();
      // console.log("Received PATCH response:", result);
      return result;
    } catch (error) {
      console.error("PATCH request error:", error);
      throw new Error("Patch request failed");
    }
  }

  /**
   * Sends a "call" request to the server to invoke a remote procedure.
   * @param {keyof D["rpc"]} name - The name of the procedure to be invoked.
   * @param {InferRpcListArgs<D["rpc"]>[N]} args - The arguments to pass to the procedure.
   * @returns {Promise<InferRpcListReturns<D["rpc"]>[N]>} - The result returned by the procedure.
   * @throws {Error} - Throws an error if the call request fails.
   */
  async call<N extends keyof D["rpc"]>(
    name: N,
    args: InferRpcListArgs<D["rpc"]>[N],
  ): Promise<InferRpcListReturns<D["rpc"]>[N] & { error: string | undefined }> {
    // console.log(
    //   `Sending CALL request for procedure ${String(name)} with args:`,
    //   args,
    // );
    try {
      const response = await this.sendRequest({
        type: "call",
        calls: [{ name, args }],
      });

      const result = await response.json();
      // console.log(
      //   `Received CALL response for procedure ${String(name)}:`,
      //   result,
      // );
      return { ...result.returns[name], error: result.error };
    } catch (error) {
      console.error(
        `CALL request error for procedure ${String(name)}:`,
        error,
      );
      throw new Error(`Failed to call procedure ${String(name)}`);
    }
  }
}
