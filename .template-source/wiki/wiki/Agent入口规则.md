# Agent入口规则

每个任务先读取当前治理仓根身份与唯一 `CONTEXT.md`，按任务触发加载规则；只读调查不生成治理状态。进入独立子仓使用其本地入口，共同授权与用户工作保护仍有效。

先消费本地 `yss-strategic-design/references/orchestration-contract.yaml` 的 `request_triage.delivery_path`，再按 Harness Profile 的允许工作单元推进。Design 未启用日常实现，不因小改动获得实现权限。

正式工作消费已批准且当前的业务资产，按 Profile 与注册表只推进本轮触发单元及依赖。

本地终点为 `work-unit.strategic-design-handoff`，完成后 `next_route: null`；本仓不生成技术设计、OpenAPI、父/垂直切片 Ticket、Slice Implementation Contract 或运行时代码，实施请求转交下游研发 Profile。

生命周期 ID 与条件门禁由注册表定义，影响面由裁剪文档定义，技能身份由 active Registry 定义；锁文件仍负责来源与投影。实施者不能自审，验证保存实际命令、退出码、范围与未覆盖边界。有效范围授权可复用；提交、推送、发布分别消费用户授权。参见 [[Fresh验证与独立审查]]、[[Ticket与流程状态]]。

## 来源

- `AGENTS.md:9-19`：本页路由、授权及完成边界依据当前入口的 ## 1. 仓库身份。
- `AGENTS.md:20-35`：本页路由、授权及完成边界依据当前入口的 ## 2. 单一事实来源。
- `AGENTS.md:91-101`：本页路由、授权及完成边界依据当前入口的 ## 10. 审查、验证与 Git。
- `AGENTS.md:11-18`：Design 身份、模板源不产产品资产、只读诊断零状态写入及显式旧实例迁移。
- `AGENTS.md:24-33`：根 Context、Profile、生命周期、影响面和 active Registry 分别持有事实；README、Wiki 不另定义规则。
- `AGENTS.md:58-58`：Design 消费本地 yss-strategic-design orchestration-contract 的 request_triage.delivery_path；本 Profile 未启用日常实现，只执行 allowed_work_units。
- `AGENTS.md:60-63`：Design 从最近可信阶段推进本轮触发单元及依赖；复用可信上游，不将导航和未来资产当每次必做项；命中条件门禁必须完成。
- `AGENTS.md:64-65`：Design 本地禁止 Tactical Design、OpenAPI、父/垂直切片 Ticket、Slice 合同和运行时代码；实施 blocked 转交下游，战略交接完成 next_route 必须 null。
- `AGENTS.md:93-93`：命中产品审查使用独立 Reviewer，实施者不自审；模板日常 self-check 消费维护规则。
- `AGENTS.md:99-100`：授权消费本地 yss-strategic-design user-decisions；有效范围授权复用，commit/push/publish 分别核验用户授权；返工或重要缺陷触发中文复盘。
- `CONTEXT.md:1-15`：根 Context 持有稳定业务语言与消费约定，正文不能授予实现权限。
