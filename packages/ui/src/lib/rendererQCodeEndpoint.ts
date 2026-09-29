import {
  buildRuntimeQCodeEndpointUrls,
  QCODE_ENV,
  type RuntimeQCodeEndpointEnv,
} from "@qcode/shared";

interface RendererImportMetaEnv {
  VITE_QCODE_BASE_URL?: string;
  VITE_QCODE_ENDPOINT_ORIGIN?: string;
}

function readRendererImportMetaEnv(): RendererImportMetaEnv {
  return ((import.meta as ImportMeta & { env?: RendererImportMetaEnv }).env ??
    {}) as RendererImportMetaEnv;
}

function createRendererQCodeEndpointEnv(
  env: RendererImportMetaEnv = readRendererImportMetaEnv(),
): RuntimeQCodeEndpointEnv {
  return {
    QCODE_ENV,
    // UI 侧的 qcode-plan 占位 provider 以前只看 QCODE_ENV，
    // 没有消费 Vite 注入的 base url，导致自定义测试域名时 renderer 和 host/service 可能不一致。
    QCODE_BASE_URL: env.VITE_QCODE_BASE_URL,
    QCODE_ENDPOINT_ORIGIN: env.VITE_QCODE_ENDPOINT_ORIGIN,
  };
}

export const RENDERER_QCODE_ENDPOINT_URLS = buildRuntimeQCodeEndpointUrls(
  createRendererQCodeEndpointEnv(),
);
