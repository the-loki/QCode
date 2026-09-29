import type { TuiReadClipboardImage, TuiWriteClipboardText } from "@qcode/tui";
import type { UiLocale } from "@qcode/i18n";
import type { Logger } from "@qcode/contracts";
import type {
  createManagedCdpBrowserRuntime,
  ManagedCdpBrowserRuntimeOptions,
} from "@qcode/adapters/browser";
import type {
  createModelAdapter,
  createQCodeApp,
  CreateModelAdapterOptions,
  configureCodingPlanApiKey,
  ConfigureCodingPlanApiKeyOptions,
  inspectQCodeSkill,
  inspectWorkspaceHookTrust,
  grantWorkspaceHookTrust,
  revokeWorkspaceHookTrustCli,
  inspectQCodeCustomCommand,
  InspectQCodeCustomCommandOptions,
  InspectQCodeSkillOptions,
  loginQCodeCli,
  loginBigmodelCodingPlan,
  LoginBigmodelCodingPlanOptions,
  LoginQCodeCliOptions,
  listQCodeCustomCommands,
  ListQCodeCustomCommandsOptions,
  loadQCodeCustomCommand,
  listQCodeSessions,
  listQCodeSkills,
  ListQCodeSessionsOptions,
  ListQCodeSkillsOptions,
  logoutQCodeCli,
  LogoutQCodeCliOptions,
  resolveLatestSession,
  ResolveLatestSessionOptions,
  RunQCodeProtocolAgentOptions,
  prepareQCodeTelemetryEnv,
  startProcessProviderRegistryRuntime,
  shutdownQCodeTelemetry,
  QCodeAppOptions,
} from "@qcode/bootstrap";
import type { CliEnv, DotenvLoadResult, LoadCliDotenvOptions } from "./env.js";
import type { PluginsCommandOverrides } from "./plugins-command.js";
import type { CliShutdownProcess } from "./shutdown.js";
import type { resolveWorkspaceGitBranch } from "./tui-workspace-git.js";

export type BootstrapModule = typeof import("@qcode/bootstrap");

export interface RunDependencies extends PluginsCommandOverrides {
  protocolLifecycle?: RunQCodeProtocolAgentOptions["lifecycle"];
  protocolInput?: NodeJS.ReadableStream;
  createManagedCdpBrowserRuntime?: (
    options?: ManagedCdpBrowserRuntimeOptions,
  ) => ReturnType<typeof createManagedCdpBrowserRuntime>;
  createModelAdapter?: (
    options?: CreateModelAdapterOptions,
  ) => ReturnType<typeof createModelAdapter>;
  createQCodeApp?: (
    options?: QCodeAppOptions,
  ) => Awaited<ReturnType<typeof createQCodeApp>> | ReturnType<typeof createQCodeApp>;
  /**
   * Session-event shaper for --output-format stream-json. Defaults to the
   * bootstrap module's, which is also what the protocol server uses; injectable
   * so a caller that supplies its own `createQCodeApp` (tests, embedders) can
   * still stream, since the bootstrap module is not loaded on that path.
   */
  mapSessionEvent?: BootstrapModule["mapSessionEvent"];
  cwd?: () => string;
  env?: CliEnv;
  inspectSkill?: (options: InspectQCodeSkillOptions) => ReturnType<typeof inspectQCodeSkill>;
  inspectWorkspaceHookTrust?: typeof inspectWorkspaceHookTrust;
  grantWorkspaceHookTrust?: typeof grantWorkspaceHookTrust;
  revokeWorkspaceHookTrustCli?: typeof revokeWorkspaceHookTrustCli;
  inspectCustomCommand?: (
    options: InspectQCodeCustomCommandOptions,
  ) => ReturnType<typeof inspectQCodeCustomCommand>;
  loginQCodeCli?: (options?: LoginQCodeCliOptions) => ReturnType<typeof loginQCodeCli>;
  loginBigmodelCodingPlan?: (
    options?: LoginBigmodelCodingPlanOptions,
  ) => ReturnType<typeof loginBigmodelCodingPlan>;
  configureCodingPlanApiKey?: (
    options: ConfigureCodingPlanApiKeyOptions,
  ) => ReturnType<typeof configureCodingPlanApiKey>;
  loadDotenv?: (options?: LoadCliDotenvOptions) => DotenvLoadResult;
  prepareQCodeTelemetryEnv?: typeof prepareQCodeTelemetryEnv;
  projectConfigPath?: string;
  listSessions?: (options: ListQCodeSessionsOptions) => ReturnType<typeof listQCodeSessions>;
  listCustomCommands?: (
    options: ListQCodeCustomCommandsOptions,
  ) => ReturnType<typeof listQCodeCustomCommands>;
  loadCustomCommand?: (
    options: InspectQCodeCustomCommandOptions,
  ) => ReturnType<typeof loadQCodeCustomCommand>;
  // headless slash 路由要和 app facade 的保留名 gate 用同一个判据；默认取 bootstrap 的，
  // 注入点只为让单测不必拉起整个 bootstrap 模块。见 prompt-command.ts。
  isReservedSlashCommandName?: BootstrapModule["isReservedQCodeSlashCommandName"];
  listSkills?: (options: ListQCodeSkillsOptions) => ReturnType<typeof listQCodeSkills>;
  logger?: Logger;
  readClipboardImage?: TuiReadClipboardImage;
  writeClipboardText?: TuiWriteClipboardText;
  resolveLatestSession?: (
    options: ResolveLatestSessionOptions,
  ) => ReturnType<typeof resolveLatestSession>;
  resolveWorkspaceGitBranch?: typeof resolveWorkspaceGitBranch;
  logoutQCodeCli?: (options?: LogoutQCodeCliOptions) => ReturnType<typeof logoutQCodeCli>;
  runQCodeProtocolAgent?: (options?: RunQCodeProtocolAgentOptions) => Promise<void>;
  runTui?: typeof import("@qcode/tui").runTui;
  skipUserConfig?: boolean;
  userConfigPath?: string;
  exitProcess?: (code: number) => void;
  shutdownCleanupTimeoutMs?: number;
  shutdownProcess?: CliShutdownProcess;
  startProcessProviderRegistryRuntime?: typeof startProcessProviderRegistryRuntime;
  shutdownQCodeTelemetry?: typeof shutdownQCodeTelemetry;
}

export type CliPermissionMode = "build" | "plan" | "edit" | "yolo";
export type CliRuntimeMode = CliPermissionMode | "auto";

export interface CliModeState {
  current?: CliRuntimeMode;
  override?: CliPermissionMode;
}

export interface CliTargetRequest {
  objective: string;
  replaceExisting: boolean;
}

export type ModeCapableApp = Awaited<ReturnType<typeof createQCodeApp>> & {
  getMode?: () => CliRuntimeMode;
  setLocale?: (locale: UiLocale) => Promise<{ locale: "en-US" | "zh-CN" }>;
  setMode?: (mode: CliRuntimeMode) => Promise<{ mode: CliRuntimeMode }>;
};

export interface CliResumeRequest {
  continueSession: boolean;
  resumeSessionId?: string;
}
