# 测试 runner 统一为 vitest

全仓此前没有 test script,仅有的 4 个测试文件用 `node:test` 手工 `node --test` 运行,无汇总入口。架构改造(命令队列、通道骨架、调度器状态机等)需要表驱动测试与注入 fake 的批量运行,决定:统一采用 vitest(根 workspace 配置 + 各包 test script),现有 4 个 `node:test` 文件迁移过来。曾考虑沿用 `node:test`(零新依赖),否决理由:无 watch/coverage、无 workspace 级汇总,后续 9 个架构 PR 都要反复跑测试,基建一次性到位更省。
