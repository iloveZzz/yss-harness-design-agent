# 垂直切片Ticket

本地终点为 `work-unit.strategic-design-handoff`，完成后 `next_route: null`；本仓不生成技术设计、OpenAPI、父/垂直切片 Ticket、Slice Implementation Contract 或运行时代码，实施请求转交下游研发 Profile。

正式切片是贯穿受影响层、可独立验证的窄行为，不能仅按技术层拆分。切片模板初始 ready-for-human，记录用户故事、API 影响、验收、公共测试 seam、当前合同、允许写路径、阻塞关系、执行结果与完成定义。

正式工作消费已批准且当前的业务资产，按 Profile 与注册表只推进本轮触发单元及依赖。

合同已批准且当前、必要门禁通过、阻塞清除并可直接实现时，编排器才可设置 ready-for-agent；编译器不能批准或改状态。业务行为采用 behavior-tdd，controlled-generation 只用于明确受控机械生成；drift/violation/new_impacts 停止受影响工作并重验。

Design 只产出业务 Ticket 集并保持 ready-for-human，垂直切片模板是历史读取材料，不用于本地创作实施票。

## 来源

- `AGENTS.md:56-66`：本页路由、授权及完成边界依据当前入口的 ## 5. `project-instance` 战略设计路由。
- `AGENTS.md:67-74`：本页路由、授权及完成边界依据当前入口的 ## 6. Ticket 与状态。
- `AGENTS.md:64-65`：Design 本地禁止 Tactical Design、OpenAPI、父/垂直切片 Ticket、Slice 合同和运行时代码；实施 blocked 转交下游，战略交接完成 next_route 必须 null。
- `AGENTS.md:60-63`：Design 从最近可信阶段推进本轮触发单元及依赖；复用可信上游，不将导航和未来资产当每次必做项；命中条件门禁必须完成。
- `AGENTS.md:71-73`：checkpoint 持有机器状态；Design 只产业务 Ticket 集且 ready-for-human，禁止父/垂直切片和 ready-for-agent；Tracker 显式选择。
- `.template-spec/templates/vertical-slice-ticket-template.md:1-20`：切片模板默认 ready-for-human，贯穿所有受影响层；Design 仅历史读取。
- `.template-spec/templates/vertical-slice-ticket-template.md:61-69`：历史模板的 Router/编译器不授 ready-for-agent；controlled-generation 仅允许机械生成，业务行为使用 behavior-tdd；Design 不在本地产出或实施此模板。
- `.template-spec/templates/vertical-slice-ticket-template.md:111-111`：drift、violation 或新影响暂停受影响工作，不能先实现再补合同；Design 仅历史读取。
- `CONTEXT.md:1-15`：根 Context 持有稳定业务语言与消费约定，正文不能授予实现权限。
- `.template-spec/agents/issue-tracker.md:1-28`：当前 local-markdown root 为 .work，旧实例按实际 tracker.root 使用根。
- `.template-spec/agents/triage-labels.md:3-15`：Ticket 使用五态标签，不等同数字人角色或临时执行状态。
- `.template-spec/process/lifecycle-registry.yaml:1-8`：active 生命周期注册表持有稳定 ID，本地执行仍受 Profile 允许范围限制。
