# YSS路由与合同编译

本地终点为 `work-unit.strategic-design-handoff`，完成后 `next_route: null`；本仓不生成技术设计、OpenAPI、父/垂直切片 Ticket、Slice Implementation Contract 或运行时代码，实施请求转交下游研发 Profile。

Design 的 active Registry 由生命周期消费，runtime_policy 明确 consumed_by_compiler:false；保留下游兼容 ID 不表示本地可以调用实现编译器。

先消费本地 `yss-strategic-design/references/orchestration-contract.yaml` 的 `request_triage.delivery_path`，再按 Harness Profile 的允许工作单元推进。Design 未启用日常实现，不因小改动获得实现权限。

技能身份、别名、能力和发现面消费 active Registry；来源、有效目录哈希与投影完整性仍由锁文件负责。共享技能只改 canonical `.agents/skills`，再生成投影并更新锁；平台专属内容按其所属 root 维护。 参见 [[技能投影与锁定]]、[[切片实现合同]]。

## Status

Disputed：当前 AGENTS 与 Registry 禁止 Design 本地 Slice 编译，并明确 Router 不消费注册表；当前 CONTEXT 的 Slice 术语仍称 yss-router，skills-maintenance 仍有 Router 消费 Registry 的旧说明。这些源文件尚未等义对齐，本页按本地执行权威解释职责，并保留冲突，不声明全部内容 current。

## 来源

- `AGENTS.md:20-35`：本页路由、授权及完成边界依据当前入口的 ## 2. 单一事实来源。
- `AGENTS.md:56-66`：本页路由、授权及完成边界依据当前入口的 ## 5. `project-instance` 战略设计路由。
- `AGENTS.md:64-65`：Design 本地禁止 Tactical Design、OpenAPI、父/垂直切片 Ticket、Slice 合同和运行时代码；实施 blocked 转交下游，战略交接完成 next_route 必须 null。
- `AGENTS.md:28-28`：Design active Registry 由生命周期消费，Router 不消费；技能身份/路由与锁的来源/投影职责分开。
- `AGENTS.md:58-58`：Design 消费本地 yss-strategic-design orchestration-contract 的 request_triage.delivery_path；本 Profile 未启用日常实现，只执行 allowed_work_units。
- `AGENTS.md:46-52`：模板源在既有授权内同步 Skill、投影、锁和分发；按强度做定向验证，日常 implementation-ready 不冒充候选或发布资格。
- `.template-spec/agents/yss-skill-registry.yaml:1-11`：active Registry 持有技能身份与发现面；本 Design 生命周期消费，编译器不消费。
- `CONTEXT.md:1-15`：根 Context 持有稳定业务语言与消费约定，正文不能授予实现权限。
