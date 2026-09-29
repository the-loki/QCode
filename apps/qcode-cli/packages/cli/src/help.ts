import { getQCodeCopy, type SupportedLocale, type UiLocale } from "@qcode/i18n";

export function formatCliHelp(
  version: string,
  locale?: UiLocale,
  detectedLocale?: SupportedLocale,
): string {
  return getQCodeCopy(locale, detectedLocale).cli.help(version);
}
