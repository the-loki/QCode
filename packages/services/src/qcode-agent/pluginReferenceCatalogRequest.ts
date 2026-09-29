import {
  qcodeProtocolMethods,
  qcodePluginsReferenceCatalogResultSchema,
  type QCodePluginsReferenceCatalogParams,
} from "@qcode/shared";
import type { QCodeProtocolClient } from "#src/qcode-agent/qcodeProtocolClient.js";

/** 旧协议严格校验响应；新展示字段走独立入口，只有 -32601 能证明旧 Agent 不支持。 */
export async function requestPluginReferenceCatalog(
  client: Pick<QCodeProtocolClient, "request">,
  params: QCodePluginsReferenceCatalogParams,
) {
  try {
    return await client.request(
      qcodeProtocolMethods.pluginsReferenceCatalogWithCategory,
      params,
      qcodePluginsReferenceCatalogResultSchema,
    );
  } catch (error) {
    if (!(typeof error === "object" && error !== null && "code" in error && error.code === -32601))
      throw error;
    return client.request(
      qcodeProtocolMethods.pluginsReferenceCatalog,
      params,
      qcodePluginsReferenceCatalogResultSchema,
    );
  }
}
