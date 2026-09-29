import {
  ProviderConfigService,
  type ProviderConfigLayerSnapshot,
  type ProviderConfigLayerUpdate,
} from "@qcode/provider";
import { NodeQCodeBuiltinProviderConfigSource } from "./qcode-builtin-provider-config-source.js";
import {
  EndpointScopedQCodeBuiltinSource,
  type EndpointScopedQCodeBuiltinSourceOptions,
} from "./endpoint-scoped-qcode-builtin-source.js";
import {
  QCodeBuiltinRemoteSynchronizer,
  type QCodeBuiltinRemoteSynchronizerOptions,
  type QCodeBuiltinRefreshResult,
} from "./qcode-builtin-remote-synchronizer.js";
import {
  NodePersonalProviderConfigRepository,
  type PersonalProviderConfigRecoveryEvent,
} from "./personal-provider-config-repository.js";

export interface NodeProviderConfigRuntimeOptions {
  readonly qcodeBuiltinFilePath: string;
  readonly qcodeBuiltinActiveFilePath?: string;
  readonly qcodeBuiltinRemote?: Omit<QCodeBuiltinRemoteSynchronizerOptions, "source">;
  readonly qcodeBuiltinEnvironment?: Omit<
    EndpointScopedQCodeBuiltinSourceOptions,
    "bundledFilePath"
  >;
  readonly onQCodeBuiltinRefreshError?: (error: unknown) => void;
  readonly onPersonalConfigRecovery?: (event: PersonalProviderConfigRecoveryEvent) => void;
  readonly onPersonalConfigPollingError?: (error: unknown) => void;
  readonly personalFilePath: string;
  readonly personalPollingIntervalMs?: number | false;
  readonly importLegacy?: (
    qcodeBuiltin: ProviderConfigLayerSnapshot,
  ) => Promise<ProviderConfigLayerUpdate | null>;
  readonly watch?: boolean;
}

/** 组装一个 Node.js 进程内共享的 QCode Built-in/Personal Config 运行边界。 */
export class NodeProviderConfigRuntime {
  readonly configService: ProviderConfigService;
  readonly #qcodeBuiltinSource:
    | NodeQCodeBuiltinProviderConfigSource
    | EndpointScopedQCodeBuiltinSource;
  readonly #personalRepository: NodePersonalProviderConfigRepository;
  readonly #remoteSynchronizer?: QCodeBuiltinRemoteSynchronizer;
  readonly #onRemoteRefreshError?: (error: unknown) => void;
  #startPromise: Promise<void> | null = null;
  #disposed = false;
  readonly #checkListeners = new Set<() => Promise<void>>();
  #checkTimer: ReturnType<typeof setInterval> | null = null;
  #checkInFlight: Promise<void> | null = null;

  constructor(options: NodeProviderConfigRuntimeOptions) {
    this.#qcodeBuiltinSource = options.qcodeBuiltinEnvironment
      ? new EndpointScopedQCodeBuiltinSource({
          bundledFilePath: options.qcodeBuiltinFilePath,
          ...options.qcodeBuiltinEnvironment,
        })
      : new NodeQCodeBuiltinProviderConfigSource({
          bundledFilePath: options.qcodeBuiltinFilePath,
          activeFilePath: options.qcodeBuiltinActiveFilePath,
          watch: options.watch,
        });
    this.#remoteSynchronizer =
      options.qcodeBuiltinRemote &&
      this.#qcodeBuiltinSource instanceof NodeQCodeBuiltinProviderConfigSource
        ? new QCodeBuiltinRemoteSynchronizer({
            source: this.#qcodeBuiltinSource,
            ...options.qcodeBuiltinRemote,
          })
        : undefined;
    this.#onRemoteRefreshError = options.onQCodeBuiltinRefreshError;
    this.#personalRepository = new NodePersonalProviderConfigRepository({
      filePath: options.personalFilePath,
      onRecovery: options.onPersonalConfigRecovery,
      onPollingError: options.onPersonalConfigPollingError,
      pollingIntervalMs: options.personalPollingIntervalMs,
      ...(options.importLegacy
        ? {
            importLegacy: async () => options.importLegacy!(await this.#qcodeBuiltinSource.read()),
          }
        : {}),
    });
    this.configService = new ProviderConfigService({
      qcodeBuiltinSource: this.#qcodeBuiltinSource,
      personalRepository: this.#personalRepository,
    });
  }

  resolveQCodeBuiltinActiveFilePath(): Promise<string> {
    return this.#qcodeBuiltinSource instanceof NodeQCodeBuiltinProviderConfigSource
      ? Promise.resolve(this.#qcodeBuiltinSource.activeFilePath)
      : this.#qcodeBuiltinSource.resolveActiveFilePath();
  }

  get personalRepository(): import("@qcode/provider").PersonalProviderConfigRepository {
    return this.#personalRepository;
  }

  /** Environment 同一周期检查中恢复未对齐依赖，不被下载 TTL 或失败挡住。 */
  onDidCheckQCodeBuiltin(listener: () => Promise<void>): () => void {
    this.#checkListeners.add(listener);
    return () => this.#checkListeners.delete(listener);
  }

  start(): Promise<void> {
    if (this.#disposed) throw new Error("NodeProviderConfigRuntime 已 dispose");
    if (this.#startPromise) return this.#startPromise;
    const startPromise = this.configService.read().then(() => {
      if (this.#disposed) return;
      void this.#checkBackground();
      // Managed Worker 无下载配置也无恢复 owner，不建立周期任务。
      if (
        this.#remoteSynchronizer ||
        this.#qcodeBuiltinSource instanceof EndpointScopedQCodeBuiltinSource ||
        this.#checkListeners.size > 0
      ) {
        this.#checkTimer = setInterval(() => {
          void this.#checkBackground();
        }, 60_000);
        this.#checkTimer.unref?.();
      }
    });
    this.#startPromise = startPromise;
    void startPromise.catch(() => {
      if (this.#startPromise === startPromise) this.#startPromise = null;
    });
    return startPromise;
  }

  refreshQCodeBuiltin(options?: { readonly force?: boolean }): Promise<QCodeBuiltinRefreshResult> {
    if (this.#disposed) return Promise.resolve("disposed");
    if (this.#qcodeBuiltinSource instanceof EndpointScopedQCodeBuiltinSource) {
      return this.#qcodeBuiltinSource.refresh(options);
    }
    return this.#remoteSynchronizer?.refresh(options) ?? Promise.resolve("skipped");
  }

  #checkBackground(): Promise<void> {
    if (this.#disposed) return Promise.resolve();
    if (this.#checkInFlight) return this.#checkInFlight;
    const check = Promise.allSettled([
      this.refreshQCodeBuiltin(),
      ...[...this.#checkListeners].map((listener) => Promise.resolve().then(listener)),
    ])
      .then((results) => {
        if (this.#disposed) return;
        for (const result of results)
          if (result.status === "rejected") this.#onRemoteRefreshError?.(result.reason);
      })
      .finally(() => {
        if (this.#checkInFlight === check) this.#checkInFlight = null;
      });
    this.#checkInFlight = check;
    return check;
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    if (this.#checkTimer) clearInterval(this.#checkTimer);
    this.#checkTimer = null;
    this.#checkListeners.clear();
    this.#remoteSynchronizer?.dispose();
    this.configService.dispose();
    this.#personalRepository.dispose();
    this.#qcodeBuiltinSource.dispose();
  }
}

export function createNodeProviderConfigRuntime(
  options: NodeProviderConfigRuntimeOptions,
): NodeProviderConfigRuntime {
  return new NodeProviderConfigRuntime(options);
}
