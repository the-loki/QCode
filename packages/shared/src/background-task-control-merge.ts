import type { QCodeBackgroundTaskControlItem } from "./background-task-controls.js";

export function mergeQCodeBackgroundTaskControlItems(
  current: readonly QCodeBackgroundTaskControlItem[],
  updates: readonly QCodeBackgroundTaskControlItem[],
): QCodeBackgroundTaskControlItem[] {
  const jobsById = new Map(current.map((job) => [job.jobId, job] as const));
  for (const job of updates) {
    jobsById.set(job.jobId, job);
  }
  return Array.from(jobsById.values());
}
