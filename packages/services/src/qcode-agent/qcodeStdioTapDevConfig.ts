import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { QCodeStdioTapDevState } from "@qcode/shared";
import { getAppConfigDir } from "#src/paths.js";
import { isEffectiveDevelopmentNodeEnv } from "#src/runtime-tools/nodeEnv.js";

interface QCodeStdioTapStateFile {
  enabled?: boolean;
}

function isQCodeStdioTapDevVisible(): boolean {
  return isEffectiveDevelopmentNodeEnv();
}

function getQCodeStdioTapDevDir(): string {
  return join(getAppConfigDir(), "dev");
}

export function getQCodeStdioTapDevLogDir(): string {
  return join(getQCodeStdioTapDevDir(), "stdio-traffic");
}

function getQCodeStdioTapDevStatePath(): string {
  return join(getQCodeStdioTapDevDir(), "qcode-stdio-tap.json");
}

function readStateFile(path: string): QCodeStdioTapStateFile {
  if (!existsSync(path)) {
    return {};
  }

  try {
    const parsed = JSON.parse(readFileSync(path, "utf-8")) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as QCodeStdioTapStateFile) : {};
  } catch {
    return {};
  }
}

export function readQCodeStdioTapDevState(): QCodeStdioTapDevState {
  const visible = isQCodeStdioTapDevVisible();
  const statePath = getQCodeStdioTapDevStatePath();
  const fileState = readStateFile(statePath);
  return {
    enabled: visible && fileState.enabled === true,
    visible,
    logDir: getQCodeStdioTapDevLogDir(),
    statePath,
  };
}

export function setQCodeStdioTapDevEnabled(enabled: boolean): QCodeStdioTapDevState {
  const visible = isQCodeStdioTapDevVisible();
  const statePath = getQCodeStdioTapDevStatePath();
  mkdirSync(getQCodeStdioTapDevDir(), { recursive: true });
  writeFileSync(
    statePath,
    `${JSON.stringify(
      {
        // 开发态 stdio 抓包是高频原始协议帧，只能通过显式开关写旁路文件，避免误进生产日志。
        enabled: visible && enabled,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
  );
  return readQCodeStdioTapDevState();
}
