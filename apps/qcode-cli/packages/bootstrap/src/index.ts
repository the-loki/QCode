// Bootstrap public API surface.

export * from "./app/create-app.js";
export type {
  ListQCodeSessionsOptions,
  PromptInput,
  ResolveLatestSessionOptions,
  ResumeOptions,
  RunQCodeProtocolAgentOptions,
  SendInputOptions,
  SendInputResult,
  SetLocaleResult,
  SteerTurnOptions,
  SubmitPromptOptions,
  UserPromptInput,
  QCodeApp,
  QCodeAppOptions,
  QCodeModelOption,
} from "./app/types.js";
export * from "./auth-login.js";
export {
  inspectQCodeCustomCommand,
  listQCodeCustomCommands,
  loadQCodeCustomCommand,
} from "./custom-commands.js";
export type {
  InspectQCodeCustomCommandOptions,
  ListQCodeCustomCommandsOptions,
  QCodeCustomCommandInspection,
} from "./custom-commands.js";
export { createModelAdapter } from "./model-factory.js";
export type { CreateModelAdapterOptions } from "./model-factory.js";
export { startProcessProviderRegistryRuntime } from "./app/process-provider-registry-runtime.js";
export type { ProcessProviderRegistryRuntimeOptions } from "./app/process-provider-registry-runtime.js";
export {
  addQCodePluginMarketplace,
  getQCodePluginsOverview,
  installQCodeMarketplacePlugin,
  listQCodePlugins,
  removeQCodePluginMarketplace,
  resolveQCodePlugins,
  setQCodePluginEnabled,
  uninstallQCodeMarketplacePlugin,
  updateQCodeMarketplacePlugin,
  updateQCodePluginMarketplace,
  validateQCodePluginPath,
} from "./plugins.js";
export type {
  AddQCodeMarketplaceOptions,
  InstallQCodeMarketplacePluginOptions,
  ListQCodePluginsOptions,
  RemoveQCodeMarketplaceOptions,
  ResolveQCodePluginsOptions,
  SetQCodePluginEnabledOptions,
  SetQCodePluginEnabledResult,
  UninstallQCodeMarketplacePluginOptions,
  UpdateQCodeMarketplaceOptions,
  UpdateQCodeMarketplacePluginOptions,
  ValidateQCodePluginPathOptions,
  QCodeAvailablePluginData,
  QCodeInstalledPluginData,
  QCodeMarketplaceSummaryData,
  QCodeMarketplaceUpdateData,
  QCodePluginInstallData,
  QCodePluginUpdateData,
  QCodePluginsOverviewData,
} from "./plugins.js";
export { runQCodeProtocolAgent } from "./qcode-protocol-entrypoint.js";
// Exposed for the CLI's --output-format stream-json: it needs the same event
// shape the protocol server emits, rather than inventing a second one.
export { mapSessionEvent } from "./qcode-protocol/session-mapper.js";
export { prepareQCodeTelemetryEnv, shutdownQCodeTelemetry } from "./telemetry-bootstrap.js";
export type { SessionTranscriptMessage, SessionTranscriptPart } from "./session-transcript.js";
export { listQCodeSessions, resolveLatestSession } from "./sessions.js";
export { inspectQCodeSkill, listQCodeSkills } from "./skills.js";
export type {
  InspectQCodeSkillOptions,
  ListQCodeSkillsOptions,
  QCodeSkillInspection,
} from "./skills.js";
// Exposed for the CLI's headless slash routing: it must decide "is this a real
// custom command?" with the *same* reserved-name gate the app facade's
// customCommandPromptResolver applies, or the two disagree and a reserved name
// reaches the model as literal prompt text. See prompt-command.ts.
export { isReservedQCodeSlashCommandName } from "./slash-command-surface.js";
export {
  grantWorkspaceHookTrust,
  inspectWorkspaceHookTrust,
  revokeWorkspaceHookTrustCli,
} from "./workspace-hook-trust-cli.js";
export type {
  WorkspaceHookTrustCliItem,
  WorkspaceHookTrustCliStatus,
  WorkspaceHookTrustCliTarget,
} from "./workspace-hook-trust-cli.js";
