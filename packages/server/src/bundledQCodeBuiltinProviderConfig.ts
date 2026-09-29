import { materializeQCodeBuiltinProviderConfig } from "@qcode/services/node";

declare const __QCODE_BUILTIN_PROVIDER_CONFIG_JSON__: string | undefined;

interface MaterializeBundledQCodeBuiltinProviderConfigOptions {
  readonly environmentConfigRoot: string;
  readonly content: string;
}

/** 返回构建时嵌入远端 Server 的 QCode Built-in Provider Config。 */
export function readBundledQCodeBuiltinProviderConfig(): string {
  if (typeof __QCODE_BUILTIN_PROVIDER_CONFIG_JSON__ !== "string") {
    throw new Error("当前构建未嵌入 QCode Built-in Provider Config");
  }
  return __QCODE_BUILTIN_PROVIDER_CONFIG_JSON__;
}

/**
 * 将 QCode Built-in Config 原子物化到所属环境的固定资源副本。
 * 升级前退出旧进程；不保留按内容 hash 增长的历史文件。
 */
export async function materializeBundledQCodeBuiltinProviderConfig(
  options: MaterializeBundledQCodeBuiltinProviderConfigOptions,
): Promise<string> {
  return materializeQCodeBuiltinProviderConfig(options);
}
