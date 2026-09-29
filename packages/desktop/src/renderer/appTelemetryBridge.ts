import type { TelemetryRendererContext } from "@qcode/shared";

interface AppTelemetryBridge {
  syncTelemetryContext(context: TelemetryRendererContext): void;
}

interface AppTelemetryBridgeDependencies {
  bridge: AppTelemetryBridge;
  createRendererContext: () => TelemetryRendererContext;
}

export function syncAppTelemetryContext({
  bridge,
  createRendererContext,
}: AppTelemetryBridgeDependencies): void {
  bridge.syncTelemetryContext(createRendererContext());
}
