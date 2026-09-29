export interface DefaultPluginMarketplace {
  id: string;
  source: string;
  name: string;
  description: string;
  pluginCount: number;
  lastUpdated?: string;
}

export const QCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID = "qcode-plugins-official";

/** Settings 三类资源发现共用；Bootstrap 单测与官方 definition 的 defaultEnabled 机械对照。 */
export const DEFAULT_ENABLED_OFFICIAL_PLUGIN_IDS: ReadonlySet<string> = new Set([
  "browser-use@qcode-plugins-official",
  "image-search@qcode-plugins-official",
  "documents@qcode-plugins-official",
  "pdf@qcode-plugins-official",
  "presentations@qcode-plugins-official",
  "spreadsheets@qcode-plugins-official",
  // node_repl 宿主：不进市场、不对用户露出，也不贡献任何 skill/command/subagent，但必须
  // 始终可用 —— node_repl 的注册门禁是「Browser Use 或 Computer Use 任一启用」，宿主自己
  // 不参与那个判断。Browser Use 默认开着，宿主若默认关就等于它上来就没有宿主。
  "node-repl-host@qcode-plugins-official",
  "skill-creator@qcode-plugins-official",
  "plugin-creator@qcode-plugins-official",
  "qcode-guide@qcode-plugins-official",
  // 电脑控制回退为默认关闭，故 computer-use 不在此名单内。
  // 该集合必须与 official-plugin-definitions.ts 里标了 defaultEnabled 的插件逐一对应，
  // bootstrap 的「Settings 默认启用集合与 CLI 的官方插件声明一致」单测机械对照两者。
]);

export const DEFAULT_PLUGIN_MARKETPLACES: DefaultPluginMarketplace[] = [
  {
    // 官方唯一市场：内置插件 only。"bundled" 哨兵由 adapters 侧翻译成
    // 本地 bundled 分片读取,绝不发起网络请求。
    id: QCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID,
    source: "bundled",
    name: QCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID,
    description: "Official QCode plugins marketplace: built-in plugins for QCode.",
    pluginCount: 0,
  },
];

// 商店「公开」分段只有一个 QCode 官方市场 id，内置与 CDN 不再拆分身份。
export const PUBLIC_STORE_MARKETPLACE_IDS = [QCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID] as const;

export function isPublicStoreMarketplaceId(id: string): boolean {
  return (PUBLIC_STORE_MARKETPLACE_IDS as readonly string[]).includes(id);
}
