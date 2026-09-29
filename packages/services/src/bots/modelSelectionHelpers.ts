import {
  type QCodeProvider,
} from "@qcode/shared";

const BOT_NATIVE_MODEL_PROVIDER_PREFIX = "native:";

export function resolveTaskModel(model: string | undefined): string | undefined {
  return model && model !== "default" ? model : undefined;
}

export function getNativeModelProviderId(qcodeProvider: QCodeProvider): string {
  return `${BOT_NATIVE_MODEL_PROVIDER_PREFIX}${qcodeProvider}`;
}
