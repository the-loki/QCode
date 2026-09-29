import { QCODE_VERSION, type QCodeEnv } from "@qcode/shared";

declare const __QCODE_CDN_BASE_URL__: string | undefined;
const DEFAULT_CDN_BASE_URL = "https://cdn-qcode.z.ai";

export interface ResolveRemoteCdnOptions {
  env?: QCodeEnv;
  locale?: string;
  timeZone?: string;
  overrideBaseUrl?: string;
  version?: string;
  now?: Date;
}

function normalizeBaseUrl(value: string): string {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("CDN URL must use http or https");
  return value.replace(/\/+$/, "");
}

export function resolveRemoteCdnBaseUrls(options: ResolveRemoteCdnOptions = {}): string[] {
  const override = options.overrideBaseUrl?.trim();
  if (override) return [normalizeBaseUrl(override)];
  const baseUrl =
    process.env.QCODE_CDN_BASE_URL?.trim() ||
    (typeof __QCODE_CDN_BASE_URL__ === "undefined" ? "" : __QCODE_CDN_BASE_URL__) ||
    DEFAULT_CDN_BASE_URL;
  return [
    `${normalizeBaseUrl(baseUrl)}/qcode/electron/releases/${options.version ?? QCODE_VERSION}`,
  ];
}
