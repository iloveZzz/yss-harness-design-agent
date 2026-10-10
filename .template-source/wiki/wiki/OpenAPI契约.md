# OpenAPI契约

本地终点为 `work-unit.strategic-design-handoff`，完成后 `next_route: null`；本仓不生成技术设计、OpenAPI、父/垂直切片 Ticket、Slice Implementation Contract 或运行时代码，实施请求转交下游研发 Profile。

OpenAPI Draft 是 review-only，OAS 3.1 YAML 为权威合同；正式影响先 Draft、锁定工具校验、独立审查与 Freeze，再实施和契约测试。无 API 影响必须有当前依据，不能用空合同自证。

战略侧只交接需求、页面动作和已批准业务规则；OpenAPI、冻结和稳定实现由下游研发接管，不能在 Design 本地补造该合同。

兼容注册表、旧模板和 Wiki 导航不是下游实施权限。 参见 [[产品设计影响与原型]]、[[切片实现合同]]。

## 来源

- `AGENTS.md:56-66`：本页路由、授权及完成边界依据当前入口的 ## 5. `project-instance` 战略设计路由。
- `AGENTS.md:75-79`：本页路由、授权及完成边界依据当前入口的 ## 7. 下游交接边界。
- `AGENTS.md:60-63`：Design 从最近可信阶段推进本轮触发单元及依赖；复用可信上游，不将导航和未来资产当每次必做项；命中条件门禁必须完成。
- `AGENTS.md:64-65`：Design 本地禁止 Tactical Design、OpenAPI、父/垂直切片 Ticket、Slice 合同和运行时代码；实施 blocked 转交下游，战略交接完成 next_route 必须 null。
- `AGENTS.md:77-78`：下游先对账目标 Context，再接管技术设计、OpenAPI、Slice、脚手架、实现和验证；覆盖率、实现仓与发布不属 Design 本地门禁。
- `CONTEXT.md:1-15`：根 Context 持有稳定业务语言与消费约定，正文不能授予实现权限。
- `.template-spec/process/lifecycle-registry.yaml:1-8`：active 生命周期注册表持有稳定 ID，本地执行仍受 Profile 允许范围限制。
