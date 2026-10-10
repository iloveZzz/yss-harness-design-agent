# Spec基线

Spec 记录用户问题、解决方案、用户故事、关键决策、需求、验收与测试 seam，不授予直接实现权限。稳定术语先在唯一根 Context 登记，正文、API 标识与代码按已确认词干使用。

正式工作消费已批准且当前的业务资产，按 Profile 与注册表只推进本轮触发单元及依赖。

当前模板 frontmatter 默认 `stage: open`、`status: ready-for-human`、`owner: ai`，业务 Ticket 草案与 Spec 同时形成，Design 校准同组 ID。正文明确 FR/NFR/AC 对应、可观察成功/拒绝/边界/恢复、非目标和未决项；没有依据时不补造阈值或性能承诺。

只有产品设计影响才强制低保真草图、状态矩阵、H1/H2 原型交付物与确认。OpenAPI Draft 在 Freeze 前仅供评审。功能包根消费 tracker.root，当前初始化示例为 `.work/`，旧实例不因示例路径被迁移。本地终点为 `work-unit.strategic-design-handoff`，完成后 `next_route: null`；本仓不生成技术设计、OpenAPI、父/垂直切片 Ticket、Slice Implementation Contract 或运行时代码，实施请求转交下游研发 Profile。 参见 [[SpecDelta]]、[[产品设计影响与原型]]。

## 来源

- `AGENTS.md:36-43`：本页路由、授权及完成边界依据当前入口的 ## 3. 语言与 Context Contract。
- `AGENTS.md:56-66`：本页路由、授权及完成边界依据当前入口的 ## 5. `project-instance` 战略设计路由。
- `AGENTS.md:39-41`：稳定术语先在唯一根 Context 登记；正式流转前对账摘要，缺失冲突或漂移阻断。
- `AGENTS.md:60-63`：Design 从最近可信阶段推进本轮触发单元及依赖；复用可信上游，不将导航和未来资产当每次必做项；命中条件门禁必须完成。
- `AGENTS.md:64-65`：Design 本地禁止 Tactical Design、OpenAPI、父/垂直切片 Ticket、Slice 合同和运行时代码；实施 blocked 转交下游，战略交接完成 next_route 必须 null。
- `.template-spec/templates/spec-template.md:1-19`：Spec 默认 ready-for-human，业务 Ticket 草案与 Spec 同时形成。
- `.template-spec/templates/spec-template.md:51-77`：验收可观察且仅产品设计影响触发原型，Draft 不作为稳定实现合同。
- `CONTEXT.md:1-15`：根 Context 持有稳定业务语言与消费约定，正文不能授予实现权限。
- `.template-spec/process/lifecycle-registry.yaml:1-8`：active 生命周期注册表持有稳定 ID，本地执行仍受 Profile 允许范围限制。
