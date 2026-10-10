# Ticket与流程状态

Ticket 是追踪对象，五态是 needs-triage、needs-info、ready-for-agent、ready-for-human、wontfix，不能与数字人角色、合同状态或临时 claimed/resolved 混用。

Tracker 由 issue-tracker.md 显式选择，不能从 Git remote 推断；当前 local-markdown 的 tracker.root 为 .work。旧 roots 只读迁移，既有实例按其配置使用功能包根。平台不可用保留待发布草案与目标，不自动改投。

Design 只形成业务 Ticket 集，保持 ready-for-human；不得创建工程父 Ticket、垂直切片或设置 ready-for-agent。

阶段工作项与 checkpoint 不替代 Ticket 五态或批准。提交、推送、发布分别消费用户授权，历史记录或审查结果不自行授予 Git 权限。参见 [[垂直切片Ticket]]、[[产品研发生命周期]]。

## 来源

- `AGENTS.md:67-74`：本页路由、授权及完成边界依据当前入口的 ## 6. Ticket 与状态。
- `AGENTS.md:91-101`：本页路由、授权及完成边界依据当前入口的 ## 10. 审查、验证与 Git。
- `AGENTS.md:71-73`：checkpoint 持有机器状态；Design 只产业务 Ticket 集且 ready-for-human，禁止父/垂直切片和 ready-for-agent；Tracker 显式选择。
- `AGENTS.md:99-100`：授权消费本地 yss-strategic-design user-decisions；有效范围授权复用，commit/push/publish 分别核验用户授权；返工或重要缺陷触发中文复盘。
- `.template-spec/agents/issue-tracker.md:1-28`：当前 tracker.root 为 .work，既有实例按实际配置使用根。
- `.template-spec/agents/triage-labels.md:3-15`：Ticket 五态不是数字人角色或临时工作状态。
- `CONTEXT.md:1-15`：根 Context 持有稳定业务语言与消费约定，正文不能授予实现权限。
