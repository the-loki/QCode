import { createLocalServices, getAppConfigDir } from "@qcode/services/node";
import {
  materializeBundledQCodeBuiltinProviderConfig,
  readBundledQCodeBuiltinProviderConfig,
} from "./bundledQCodeBuiltinProviderConfig.js";
import { createHttpServer } from "./http.js";

async function main(): Promise<void> {
  const qcodeBuiltinProviderConfigFilePath = await materializeBundledQCodeBuiltinProviderConfig({
    environmentConfigRoot: getAppConfigDir(),
    content: readBundledQCodeBuiltinProviderConfig(),
  });
  const port = Number(process.env["PORT"]) || 3030;
  const host = process.env["QCODE_SERVER_HOST"]?.trim() || process.env["HOST"]?.trim() || undefined;
  const staticRoot = process.env["QCODE_WEB_STATIC_ROOT"]?.trim() || undefined;
  const authToken = process.env["QCODE_SERVER_AUTH_TOKEN"]?.trim() || undefined;
  const services = createLocalServices({
    qcodeBuiltinProviderConfigFilePath,
    providerProvisioningTargetEnabled: Boolean(authToken),
  });

  createHttpServer(services, port, {
    ...(host ? { host } : {}),
    ...(staticRoot ? { staticRoot, spaFallback: true } : {}),
    ...(authToken ? { authToken, authRequired: true } : {}),
  });
}

void main().catch((error: unknown) => {
  console.error("[qcode-server:http] startup failed", error);
  process.exitCode = 1;
});
