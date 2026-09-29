import { DEFAULT_QCODE_ENDPOINT_ORIGIN } from "./qcodeEndpoint.js";

export const QCODE_SOURCE_HEADERS = {
  "User-Agent": "QCode/unknown",
  "HTTP-Referer": DEFAULT_QCODE_ENDPOINT_ORIGIN,
  "X-Title": "Z Code@electron",
} as const;

export interface BuildQCodeSourceHeadersFromContextOptions {
  appVersion?: string;
  arch?: string;
  clientLanguage?: string;
  clientTimezone?: string;
  deviceMid?: string;
  endpointOrigin?: string;
  osVersion?: string;
  platform?: string;
  releaseChannel?: string;
  sourceTitle?: string;
}

export function normalizeQCodeSourceHeaderValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || !/^[\x20-\x7e]+$/.test(trimmed)) {
    return undefined;
  }
  return trimmed;
}

export function buildQCodeSourceHeadersFromContext(
  options: BuildQCodeSourceHeadersFromContextOptions = {},
): Record<string, string> {
  const appVersion = normalizeQCodeSourceHeaderValue(options.appVersion);
  const arch = normalizeQCodeSourceHeaderValue(options.arch);
  const clientLanguage = normalizeQCodeSourceHeaderValue(options.clientLanguage) ?? "unknown";
  const clientTimezone = normalizeQCodeSourceHeaderValue(options.clientTimezone) ?? "unknown";
  const deviceMid = normalizeQCodeSourceHeaderValue(options.deviceMid);
  const endpointOrigin =
    normalizeQCodeSourceHeaderValue(options.endpointOrigin) ?? DEFAULT_QCODE_ENDPOINT_ORIGIN;
  const osVersion = normalizeQCodeSourceHeaderValue(options.osVersion);
  const platform = normalizeQCodeSourceHeaderValue(options.platform);
  const releaseChannel = normalizeQCodeSourceHeaderValue(options.releaseChannel);
  const sourceTitle = normalizeQCodeSourceHeaderValue(options.sourceTitle) ?? "electron";

  return {
    ...QCODE_SOURCE_HEADERS,
    "HTTP-Referer": endpointOrigin,
    "User-Agent": `QCode/${appVersion ?? "unknown"}`,
    ...(appVersion ? { "X-QCode-App-Version": appVersion } : {}),
    "X-Title": `Z Code@${sourceTitle}`,
    ...(platform && arch ? { "X-Platform": `${platform}-${arch}` } : {}),
    ...(releaseChannel ? { "X-Release-Channel": releaseChannel } : {}),
    "X-Client-Language": clientLanguage,
    "X-Client-Timezone": clientTimezone,
    ...(platform ? { "X-Os-Category": normalizeOsCategory(platform) } : {}),
    ...(osVersion ? { "X-Os-Version": osVersion } : {}),
    ...(deviceMid ? { "X-Device-Mid": deviceMid } : {}),
  };
}

function normalizeOsCategory(platform: string): string {
  switch (platform) {
    case "darwin":
      return "macos";
    case "win32":
      return "windows";
    default:
      return "linux";
  }
}
