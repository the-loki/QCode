import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      // tsconfig paths "@/*" 的 vitest 等价物;源码按 TS 约定以 .js 后缀引用 .ts 文件
      { find: /^@\/(.+)\.js$/, replacement: `${srcDir}/$1.ts` },
      { find: /^@\/(.+)$/, replacement: `${srcDir}/$1` },
    ],
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
