import { z } from "zod";

/**
 * QCode agent 提供方的单一真源。
 *
 * 类型 QCodeProvider、运行时 schema qcodeProviderSchema 都从这里派生,
 * 避免各处内联 z.enum([...]) 副本随新增/删除 provider 漂移。
 * 本模块只依赖 zod(叶子),可被 validation / qcode-protocol 等无环引用。
 */
const QCODE_PROVIDERS = ["glm"] as const;

export const qcodeProviderSchema = z.enum(QCODE_PROVIDERS);

export type QCodeProvider = (typeof QCODE_PROVIDERS)[number];
