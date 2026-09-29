# 命令上行 admission 收敛为 TaskCommandQueue 单模块

会话命令上行曾有三条写入路径(旧 `sendPrompt`、host 队列 `enqueueTaskCommand`、v4 `sendConversationCommandV4`),"这条输入是否过期"的 stale 判定在 renderer(`sourceCommandId`)、host(`ownerRunId`)、CLI(`baseRevision`)三个进程各写一遍。决定:收敛为一个 TaskCommandQueue 模块,interface 只有 enqueue/ack/terminal;host owner/lease 路由判定与 CLI `CommandInbox` 的串行 admission CAS 都**保留**,但降级为该模块 implementation 的内部协作者,词汇统一为一套——目标是一个显式 interface,不是消灭进程边界(AGENTS.md 的 owner/lease、跨 Host 路由、stale run 防护不因此删除)。

## 契约

**ACK ≠ terminal**:命令被 ACK 后队列条目不移除;条目只能由流事件 terminal(inputId/traceId 匹配)移除。手机/远控断线重连后 pending 不丢依赖此语义,必须由测试钉住。

## 后果

- 旧 `sendPrompt`(@deprecated)先收编走新队列,其 3 处真实调用方(bots Telegram 入站、host off-peak 派发、host cron 派发)迁移后删除该方法。
- renderer 侧 `dispatchCommand` 闭包的 commandPipeline 化是后续独立步骤(与 DraftLifecycle 共享词汇)。
- 曾考虑"host 队列与 CLI inbox 作为并列 adapter、各自保留词汇"——否决:三套词汇正是无 locality 的根源。
