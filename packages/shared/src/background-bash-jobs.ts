import {
  collectVisibleQCodeBackgroundTaskControlItems,
  getQCodeBackgroundTaskControlItemElapsedMs,
  isActiveQCodeBackgroundTaskControlItem,
  parseQCodeBackgroundTaskControlItems,
  type QCodeBackgroundTaskControlItem,
  type QCodeBackgroundTaskControlStatus,
} from "./background-task-controls.js";

export type QCodeBackgroundBashJobStatus = QCodeBackgroundTaskControlStatus;
export type QCodeBackgroundBashJob = QCodeBackgroundTaskControlItem & {
  taskKind: "bash";
};

export function parseQCodeBackgroundBashJobs(value: unknown): QCodeBackgroundBashJob[] {
  return parseQCodeBackgroundTaskControlItems(value).filter(isBackgroundBashJob);
}

export function isActiveQCodeBackgroundBashJob(job: QCodeBackgroundBashJob): boolean {
  return isActiveQCodeBackgroundTaskControlItem(job);
}

export function getQCodeBackgroundBashJobElapsedMs(
  job: QCodeBackgroundBashJob,
  now = Date.now(),
): number {
  return getQCodeBackgroundTaskControlItemElapsedMs(job, now);
}

export function collectVisibleQCodeBackgroundBashJobs(
  jobs: readonly QCodeBackgroundBashJob[],
  now = Date.now(),
  thresholdMs = 30_000,
): Array<QCodeBackgroundBashJob & { elapsedMs: number }> {
  return collectVisibleQCodeBackgroundTaskControlItems(jobs, now, thresholdMs) as Array<
    QCodeBackgroundBashJob & { elapsedMs: number }
  >;
}

function isBackgroundBashJob(job: QCodeBackgroundTaskControlItem): job is QCodeBackgroundBashJob {
  return job.taskKind === "bash";
}
