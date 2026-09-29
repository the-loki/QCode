import { recordArmsCustomEventForE2E } from "@zcode/ui";
import { DesktopCommandIds, buildLocalMediaPreviewUrl, type IPlatformService } from "@zcode/shared";

import { desktopBrowserPlatformBridge } from "./desktopBrowserPlatformBridge.js";

export function createDesktopPlatform(options: {
  isLocalDevelopmentRuntime: boolean;
}): IPlatformService {
  return {
    canSelectFilePath: true,
    createLocalMediaPreviewUrl: buildLocalMediaPreviewUrl,
    isLocalDevelopmentRuntime: options.isLocalDevelopmentRuntime,
    selectDirectory: () => window.qcode.selectDirectory(),
    selectFile: () => window.qcode.selectFile(),
    selectFiles: () => window.qcode.selectFiles?.() ?? Promise.resolve([]),
    createTempTextAttachment: (payload) => window.qcode.createTempTextAttachment(payload),
    onRemoteConnectionLog: (handler) => window.qcode.onRemoteConnectionLog(handler),
    onRemoteSessionClosed: (handler) => window.qcode.onRemoteSessionClosed(handler),
    onBotRemoteWorkspaceReconnected: (handler) =>
      window.qcode.onBotRemoteWorkspaceReconnected(handler),
    activateOrSetWorkspace: (path) =>
      window.qcode.activateOrSetWorkspace?.(path) ?? Promise.resolve({ activated: false }),
    connectRemote: (remoteOptions, requestId, context) =>
      window.qcode.connectRemote(remoteOptions, requestId, context),
    cancelPendingRemoteConnection: (requestId) =>
      window.qcode.cancelPendingRemoteConnection?.(requestId) ?? Promise.resolve(),
    bindRemoteWorkspaceSessionContext: (context) =>
      window.qcode.bindRemoteWorkspaceSessionContext?.(context) ?? Promise.resolve(),
    disposeRemoteSession: (sessionId) => window.qcode.disposeRemoteSession(sessionId),
    isDockerAvailable: () => window.qcode.isDockerAvailable(),
    listWSLDistros: () => window.qcode.listWSLDistros(),
    listDockerContainers: () => window.qcode.listDockerContainers(),
    listSSHConfigAliases: () => window.qcode.listSSHConfigAliases(),
    loadMcpFromUserDirectory: (payload) => window.qcode.loadMcpFromUserDirectory(payload),
    saveMcpToUserDirectory: (payload) => window.qcode.saveMcpToUserDirectory(payload),
    migrateLegacyCommonMcp: (payload) => window.qcode.migrateLegacyCommonMcp(payload),
    openExternal: (url) => window.qcode.openExternal(url),
    openFeedback: () => window.qcode.executeDesktopCommand(DesktopCommandIds.OpenFeedback),
    openCommunity: () => window.qcode.executeDesktopCommand(DesktopCommandIds.OpenCommunity),
    canOpenCommunity: (locale) => window.qcode.canOpenCommunity(locale),
    openInFileManager: (path) => window.qcode.openInFileManager(path),
    openExternalFile: (path) => window.qcode.openExternalFile(path),
    openCuaPermissionOnboarding: window.qcode.openCuaPermissionOnboarding
      ? (permissionOptions) =>
          window.qcode.openCuaPermissionOnboarding?.(permissionOptions) ??
          Promise.resolve({ success: false, error: "not_supported" })
      : undefined,
    prepareCuaHelperPermissionDrag: window.qcode.prepareCuaHelperPermissionDrag
      ? () =>
          window.qcode.prepareCuaHelperPermissionDrag?.() ??
          Promise.resolve({ success: false, error: "not_supported" })
      : undefined,
    startCuaHelperPermissionDrag: window.qcode.startCuaHelperPermissionDrag
      ? () => window.qcode.startCuaHelperPermissionDrag?.()
      : undefined,
    registerOAuthState: (payload) => window.qcode.registerOAuthState(payload),
    onOAuthCallback: (callback) => window.qcode.onOAuthCallback(callback),
    onPaymentCallback: (callback) => window.qcode.onPaymentCallback(callback),
    onShareImport: (callback) => window.qcode.onShareImport?.(callback) ?? (() => {}),
    notifyRendererReady: () => window.qcode.notifyRendererReady(),
    reportTelemetryEvent: (payload) => window.qcode.reportTelemetryEvent(payload),
    reportArmsCustomEvent: (payload) => {
      recordArmsCustomEventForE2E(payload);
      return window.qcode.reportArmsCustomEvent(payload);
    },
    getRendererActionTraceConfig: window.qcode.getRendererActionTraceConfig
      ? () => window.qcode.getRendererActionTraceConfig!()
      : undefined,
    onRendererActionTraceConfigChanged: window.qcode.onRendererActionTraceConfigChanged
      ? (callback) => window.qcode.onRendererActionTraceConfigChanged!(callback)
      : undefined,
    reportLocalTtftBatch: (batch) => window.qcode.reportLocalTtftBatch(batch),
    reportRendererActionTraceBatch: window.qcode.reportRendererActionTraceBatch
      ? (batch) => window.qcode.reportRendererActionTraceBatch!(batch)
      : undefined,
    reportRendererHeapSample: window.qcode.reportRendererHeapSample
      ? (sample) => window.qcode.reportRendererHeapSample!(sample)
      : undefined,
    showTaskNotification: (payload) => window.qcode.showTaskNotification(payload),
    syncWindowTabs: (paths) => window.qcode.syncWindowTabs(paths),
    syncWindowUnreadCount: (count) => window.qcode.syncWindowUnreadCount(count),
    syncActiveTaskSession: (sessionId) => window.qcode.syncActiveTaskSession(sessionId),
    syncAppSettings: (patch) => window.qcode.syncAppSettings?.(patch),
    setShortcutRecordingActive: (active) => window.qcode.setShortcutRecordingActive?.(active),
    onFocusTab: (handler) => window.qcode.onFocusTab(handler),
    onNewTab: (handler) => window.qcode.onNewTab(handler),
    onCloseActiveContextRequest: (handler) =>
      window.qcode.onCloseActiveContextRequest?.(handler) ?? (() => {}),
    onOpenBrowserUrl: (handler) => window.qcode.onOpenBrowserUrl?.(handler) ?? (() => {}),
    onBrowserViewScreenshotSurfacePrepare: (handler) =>
      window.qcode.onBrowserViewScreenshotSurfacePrepare?.(handler) ?? (() => {}),
    onBrowserViewScreenshotSurfaceRelease: (handler) =>
      window.qcode.onBrowserViewScreenshotSurfaceRelease?.(handler) ?? (() => {}),
    browserViewScreenshotSurfaceReady: (payload) =>
      window.qcode.browserViewScreenshotSurfaceReady?.(payload),
    ...desktopBrowserPlatformBridge,
    onNewTask: (handler) => window.qcode.onNewTask(handler),
    onOpenWorkspace: (handler) => {
      // 开发态或升级后的旧窗口可能仍运行未暴露 onOpenWorkspace 的 preload，
      // renderer 直接调用会在启动时崩溃。这里和 activateOrSetWorkspace 一样做兼容兜底，
      // 缺少该 bridge 时只禁用原生菜单回调，不影响应用继续打开。
      return window.qcode.onOpenWorkspace?.(handler) ?? (() => {});
    },
    onOpenWorkspacePath: (handler) => window.qcode.onOpenWorkspacePath?.(handler) ?? (() => {}),
    onOpenFeedbackDialog: (handler) => window.qcode.onOpenFeedbackDialog?.(handler) ?? (() => {}),
    onOpenTicketsPanel: (handler) => window.qcode.onOpenTicketsPanel?.(handler) ?? (() => {}),
    onWindowFullscreenChanged: (handler) => window.qcode.onWindowFullscreenChanged(handler),
    getDesktopWindowChromeState: window.qcode.getDesktopWindowChromeState
      ? () => window.qcode.getDesktopWindowChromeState!()
      : undefined,
    onDesktopWindowChromeStateChanged: window.qcode.onDesktopWindowChromeStateChanged
      ? (handler) => window.qcode.onDesktopWindowChromeStateChanged!(handler)
      : undefined,
    getWindowControlsOverlayMetrics: () => window.qcode.getWindowControlsOverlayMetrics?.() ?? null,
    onWindowControlsOverlayChanged: (handler) =>
      window.qcode.onWindowControlsOverlayChanged?.(handler) ?? (() => {}),
    getDesktopZoomLevel: () =>
      window.qcode.getDesktopZoomLevel?.() ?? Promise.resolve({ zoomLevel: 0 }),
    onDesktopZoomLevelChanged: (handler) =>
      window.qcode.onDesktopZoomLevelChanged?.(handler) ?? (() => {}),
    onTaskNotificationClick: (handler) => window.qcode.onTaskNotificationClick(handler),
    exportLogs: () => window.qcode.exportLogs(),
    captureWindowScreenshot: () =>
      window.qcode.captureWindowScreenshot?.() ?? Promise.resolve(null),
    getDesktopSessionActivity: () =>
      window.qcode.getDesktopSessionActivity?.() ??
      Promise.resolve({ runningAgentSessionCount: 0 }),
    getZCodeStdioTapDevState: () =>
      window.qcode.getZCodeStdioTapDevState?.() ??
      Promise.resolve({ enabled: false, visible: false, logDir: "", statePath: "" }),
    onSettingsChanged: (callback) => window.qcode.onSettingsChanged?.(callback) ?? (() => {}),
    onApplicationLocaleChanged: (callback) =>
      window.qcode.onApplicationLocaleChanged?.(callback) ?? (() => {}),
    getInstalledEditors: () => window.qcode.getInstalledEditors(),
    getApplicationIcon: (bundleId) =>
      window.qcode.getApplicationIcon?.(bundleId) ?? Promise.resolve(null),
    openInEditor: (editorId, path, editorOptions) =>
      window.qcode.openInEditor(editorId, path, editorOptions),
    executeDesktopCommand: (command) => window.qcode.executeDesktopCommand(command),
    setApplicationLocale: (locale) => window.qcode.setApplicationLocale(locale),
    getSystemLocale: () =>
      window.qcode.getSystemLocale?.() ??
      Promise.resolve(navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en-US"),
    setTitleBarTheme: (theme) => window.qcode.setTitleBarTheme(theme),
    getDeviceId: () =>
      (window as Window & { __QCODE_DEVICE_ID__?: string }).__QCODE_DEVICE_ID__ ?? "",
  };
}
