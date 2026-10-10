# SpecDelta

Spec Delta 记录相对既有冻结 Spec 的 ADDED / MODIFIED / REMOVED 行为、验收场景与测试映射，不代替完整 Spec、OpenAPI 或架构资产。

当前注册表保留 artifact.spec-delta，触发为已有冻结 Spec 的高风险行为变化；全新产品、全新模块与低风险调整不生成空 Delta。根据实际 UI/API/数据/风险影响恢复批准基线，保留可执行验证与回滚依据。

正式工作消费已批准且当前的业务资产，按 Profile 与注册表只推进本轮触发单元及依赖。

本地终点为 `work-unit.strategic-design-handoff`，完成后 `next_route: null`；本仓不生成技术设计、OpenAPI、父/垂直切片 Ticket、Slice Implementation Contract 或运行时代码，实施请求转交下游研发 Profile。

Delta 不让正式绑定任务降级，不自行批准契约或授予实现资格。参见 [[Spec基线]]、[[影响面分诊与流程裁剪]]。

## 来源

- `AGENTS.md:56-66`：本页路由、授权及完成边界依据当前入口的 ## 5. `project-instance` 战略设计路由。
- `AGENTS.md:60-63`：Design 从最近可信阶段推进本轮触发单元及依赖；复用可信上游，不将导航和未来资产当每次必做项；命中条件门禁必须完成。
- `AGENTS.md:64-65`：Design 本地禁止 Tactical Design、OpenAPI、父/垂直切片 Ticket、Slice 合同和运行时代码；实施 blocked 转交下游，战略交接完成 next_route 必须 null。
- `.template-spec/process/lifecycle-registry.yaml:268-271`：Spec Delta 触发为已有冻结 Spec 的高风险行为变化。
- `CONTEXT.md:1-15`：根 Context 持有稳定业务语言与消费约定，正文不能授予实现权限。
