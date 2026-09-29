import type { WorkspacePurpose, QCodeTaskMeta } from "@qcode/shared";

export type QCodeTaskListKind = "pinned" | "archived" | "timeline" | "active";
export type QCodeTaskListSortBy = "created" | "updated";

export interface QCodeTaskListWorkspaceScope {
  workspacePath: string;
  workspaceIdentity?: string;
  workspacePurpose?: WorkspacePurpose;
}

export interface QCodeTaskListQuery {
  kind: QCodeTaskListKind;
  workspaceScopes: QCodeTaskListWorkspaceScope[];
  sortBy: QCodeTaskListSortBy;
  search?: string;
  limit?: number;
}

export type QCodeTaskListItem = QCodeTaskMeta & {
  searchSnippet?: string;
  searchSnippets?: string[];
};

export interface QCodeTaskListResult {
  items: QCodeTaskListItem[];
  total: number;
  hasMore: boolean;
}

export type QCodeTaskGroupColor =
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple";

export interface QCodeTaskGroup {
  id: string;
  title: string;
  color: QCodeTaskGroupColor;
  createdAt: number;
  updatedAt: number;
}

export interface QCodeGroupedTaskRef {
  workspacePath: string;
  workspaceIdentity?: string;
  taskId: string;
}

export type QCodeGroupedTaskViewTopLevelNodeRef =
  | { type: "group"; groupId: string }
  | { type: "task"; task: QCodeGroupedTaskRef };

export type QCodeGroupedTaskViewNode =
  | {
      type: "group";
      group: QCodeTaskGroup;
      tasks: QCodeTaskListItem[];
      sortOrder?: number;
    }
  | {
      type: "task";
      task: QCodeTaskListItem;
      sortOrder?: number;
    };

export interface QCodeGroupedTaskView {
  nodes: QCodeGroupedTaskViewNode[];
}

export interface QCodeGroupedTaskViewQuery {
  workspaceScopes: QCodeTaskListWorkspaceScope[];
  includeAllWorkspaces?: boolean;
}

// ── grouped 原始结构（不 join tasks 表）──
// grouped 视图的任务数据源迁到 sessions-index 后，服务端只提供分组结构
// （task_groups / task_group_members / task_group_view_node_orders），
// 由客户端与 sessions-index 会话做 join。

/** 组成员引用（不含任务 meta；task 内容由 sessions-index 提供）。 */
export interface QCodeGroupedTaskViewStructureMember {
  groupId: string;
  /** 服务端口径 workspaceKey（resolveWorkspaceKey：identity ?? path），join 匹配键。 */
  workspaceKey: string;
  workspacePath: string;
  workspaceIdentity?: string;
  taskId: string;
  /** null = 尚未落 sort_order（新加入组）；客户端按 addedAt 降序补内存序。 */
  sortOrder: number | null;
  addedAt: number;
}

/** 顶层节点排序（task_group_view_node_orders，node_key 已解析为结构化引用）。 */
export type QCodeGroupedTaskViewStructureTopOrder =
  | { type: "group"; groupId: string; sortOrder: number }
  | { type: "task"; workspaceKey: string; taskId: string; sortOrder: number };

export interface QCodeGroupedTaskViewStructure {
  /** 已按 workspaceScopes 可见性过滤的 group（bootstrap workspace group 只在其 workspace 可见）。 */
  groups: QCodeTaskGroup[];
  /** 全量组成员（含不可见 group 的成员——顶层排除规则需要全量判断）。 */
  members: QCodeGroupedTaskViewStructureMember[];
  topLevelOrders: QCodeGroupedTaskViewStructureTopOrder[];
}

export interface QCodeGroupedTaskViewOrderInput {
  workspaceScopes: QCodeTaskListWorkspaceScope[];
  topLevelNodes: QCodeGroupedTaskViewTopLevelNodeRef[];
  groups: Array<{
    groupId: string;
    taskRefs: QCodeGroupedTaskRef[];
  }>;
}

export interface QCodeWorkspaceEventSubscriptionParams {
  workspacePath: string;
  workspaceIdentity?: string;
}
