import { useQCodeStoreWithDefault } from "@/store/StoreProvider.js";

export function useIsOfficeMode(): boolean {
  return useQCodeStoreWithDefault((state) => state.interfaceMode === "office", false);
}
