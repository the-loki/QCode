# tasks-index.sqlite 连接收敛与 runId 格式冻结

`tasks-index.sqlite` 曾有 6 条连接在写(scheduler 进程 1 条 + host/services 进程 5 个 repo 实例各 1 条),automation run 的 claim→dispatch→settle 生命周期横跨 2 进程 7+ 文件,runId 格式 `${automationId}:${scheduledAt}` 泄漏成跨进程隐性契约(host 用 `includes(":manual:")` 字符串反解 trigger)。决定:

1. **连接按进程收敛**:host/services 进程内 repo 单例化、注入共享(6→2 条),跨进程并发靠 WAL + busy_timeout。单一写者进程(scheduler 进程收编全部写入)作为后续演进项,暂不做。
2. **runId 格式冻结不改**:编解码收进 scheduler 模块 interface,host 通过 API 获取 trigger,不再手写反解。存量 `automation_runs` 数据零迁移;结构化 runId 被否决。
3. **run-settlement 合一**:cron/off-peak/manual 三种 trigger 成为 union 字段,`cronRunSubscriptions`/`offPeakRunSubscriptions` 两张 Map 合一,`cronRunLifecycle`/`manualClaimRelease`/`offPeakDispatchSettlement` 变成模块内部策略;misfire、退避、心跳只写一遍。
