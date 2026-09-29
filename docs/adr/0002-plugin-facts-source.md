# 插件事实源:已安装/启用/抑制只有一个推导出处

commands/skills/subagents/UI 曾在四个文件各自重读 CLI config、组装候选根、做 suppressedBuiltins 过滤,复制已产生可观察分歧:同一插件解析到不同物理 root(cache 优先 vs installed 优先),且 inline 目录(`config.dirs`)中的 subagent 被 subagentsService 漏掉。决定:插件"已安装/启用/抑制"的推导收为单一模块(位于 `packages/services/src/plugins`),返回 `{ pluginId, marketplace, rootPath, source, enabled }`;标准候选根顺序为 **inline dirs → official cache → installed_plugins.json,first-wins 去重**。UI(含 Store Listing 的 Restorable/Orphaned 推导)不再自行推导,后续由 overview 协议携带语义(独立步骤)。

## 后果

- subagents 消费者的 rootPath 解析结果会变(inline 目录被纳入、cache 优先)——这是有意的行为修正,随模块化 PR 标注 bug fix。
- 被否决的替代:保留顺序差异作为各消费者参数——同一插件物理 root 不同将持续存在,违背单一事实源的目标。
