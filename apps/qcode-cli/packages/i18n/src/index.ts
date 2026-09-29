import type { UiLocale, SupportedLocale } from "@qcode/contracts";
import { enUS } from "./locales/en-US.js";
import { zhCN } from "./locales/zh-CN.js";
import {
  DEFAULT_LOCALE,
  detectLocale,
  isSupportedLocale,
  isUiLocale,
  resolveLocale,
  SUPPORTED_LOCALES,
} from "./locale.js";
import type { QCodeCopy } from "./types.js";

export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  detectLocale,
  isSupportedLocale,
  isUiLocale,
  resolveLocale,
};
export type { LocaleDetectionInput } from "./locale.js";
export type { CliCopy, TuiCopy, UiLocale, SupportedLocale, QCodeCopy } from "./types.js";

const CATALOGS: Record<SupportedLocale, QCodeCopy> = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

export function getQCodeCopy(locale?: UiLocale | string, detected?: string | null): QCodeCopy {
  return CATALOGS[resolveLocale(locale, detected)];
}
