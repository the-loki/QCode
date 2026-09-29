import type { QCodeSessionFile, QCodeTaskMeta } from "@qcode/shared";
import { qcodeSessionFileSchema, qcodeTaskMetaSchema, qcodeTaskModeSchema } from "@qcode/shared";

export type LegacyTaskSessionFile = Omit<QCodeSessionFile, "meta"> & {
  meta: Omit<QCodeTaskMeta, "mode"> & { mode?: QCodeTaskMeta["mode"] };
};

const legacyTaskSessionFileSchema = qcodeSessionFileSchema.extend({
  // Claude 原生迁移会按清洗路径删除 meta.mode。
  // legacy snapshot 读取/写入仍要校验其它必需字段，但不能再强制把被过滤字段补回文件。
  meta: qcodeTaskMetaSchema.extend({
    mode: qcodeTaskModeSchema.optional(),
  }),
});

export function parseLegacyTaskSessionFile(input: unknown): LegacyTaskSessionFile {
  return legacyTaskSessionFileSchema.parse(input);
}

export function safeParseLegacyTaskSessionFile(input: unknown) {
  return legacyTaskSessionFileSchema.safeParse(input);
}
