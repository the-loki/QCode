import { buildRuntimeQCodeApiUrl, resolveZaiBusinessBaseUrl } from "@qcode/shared";

export const QCODE_CLIENT_SCENES_URL = buildRuntimeQCodeApiUrl(
  process.env,
  "/api/v1/client/scenes",
);

export const ZAI_API_HOST = resolveZaiBusinessBaseUrl(process.env);
