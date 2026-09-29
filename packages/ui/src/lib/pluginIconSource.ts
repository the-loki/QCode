import documentsIconUrl from "@/assets/plugin-icons/documents.png";
import imageSearchIconUrl from "@/assets/plugin-icons/image-search.png";
import pdfIconUrl from "@/assets/plugin-icons/pdf.png";
import pluginCreatorIconUrl from "@/assets/plugin-icons/plugin-creator.png";
import presentationsIconUrl from "@/assets/plugin-icons/presentations.png";
import spreadsheetsIconUrl from "@/assets/plugin-icons/spreadsheets.png";
import androidEmulatorIconUrl from "@/assets/plugin-icons/android-emulator.png";
import browserUseIconUrl from "@/assets/plugin-icons/browser-use.png";
import iosSimulatorIconUrl from "@/assets/plugin-icons/ios-simulator.png";
import restoreLegacySessionsIconUrl from "@/assets/plugin-icons/restore-legacy-sessions.png";
import skillCreatorIconUrl from "@/assets/plugin-icons/skill-creator.png";
import qcodeCuaIconUrl from "@/assets/plugin-icons/qcode-cua.png";
import qcodeGuideIconUrl from "@/assets/plugin-icons/qcode-guide.png";
import { isTrustedImageUrl } from "@/lib/trustedImageUrl.js";

const OFFICIAL_PLUGIN_ICON_BY_ID: Readonly<Record<string, string>> = {
  "documents@qcode-plugins-official": documentsIconUrl,
  "image-search@qcode-plugins-official": imageSearchIconUrl,
  "pdf@qcode-plugins-official": pdfIconUrl,
  "plugin-creator@qcode-plugins-official": pluginCreatorIconUrl,
  "presentations@qcode-plugins-official": presentationsIconUrl,
  "spreadsheets@qcode-plugins-official": spreadsheetsIconUrl,
  "android-emulator@qcode-plugins-official": androidEmulatorIconUrl,
  "browser-use@qcode-plugins-official": browserUseIconUrl,
  "ios-simulator@qcode-plugins-official": iosSimulatorIconUrl,
  "restore-legacy-sessions@qcode-plugins-official": restoreLegacySessionsIconUrl,
  "skill-creator@qcode-plugins-official": skillCreatorIconUrl,
  "computer-use@qcode-plugins-official": qcodeCuaIconUrl,
  "qcode-guide@qcode-plugins-official": qcodeGuideIconUrl,
};

const TRUSTED_BUNDLED_PLUGIN_ICONS = new Set(Object.values(OFFICIAL_PLUGIN_ICON_BY_ID));

/** 按完整身份解析客户端自有图标，避免商店、候选和消息各自维护不同例外。 */
export function resolvePluginIconSource(
  pluginId: string | undefined,
  icon?: string,
): string | undefined {
  if (pluginId) {
    const bundledIcon = OFFICIAL_PLUGIN_ICON_BY_ID[pluginId];
    if (bundledIcon) return bundledIcon;
  }
  return isTrustedImageUrl(icon) ? icon : undefined;
}

/** Session 投影已完成身份匹配；仅放行固定打包资源，不放宽任意本地 URL。 */
export function isTrustedPluginIconSource(icon: string | undefined): icon is string {
  return Boolean(icon && TRUSTED_BUNDLED_PLUGIN_ICONS.has(icon)) || isTrustedImageUrl(icon);
}
