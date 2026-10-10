# Fresh验证与独立审查

Fresh Verification 证明当前任务范围、资产和触发合同的真实行为，不等于全仓全套检查。记录实际命令、退出码、范围和未覆盖项；过去跑过或实现者自报不能作为当前完成证据。

同一边界的输入字节、校验器/schema、命令参数与仓根未变时可以复用实际证据；变化只使受影响依赖失效。恢复、handoff 与正式边界重新核验当前性，未知则重跑适用检查；修复后按差异、受影响结论和依赖定向复审。

命中的产品专业审查由独立 Reviewer 执行，实施者不得自审；模板日常维护按适用 L1/L2/L3 留证，自检默认出口 implementation-ready，强度不自动触发候选冻结或独立审查。

覆盖率、实现仓、可合并与发布不是 Design 本地门禁或完成结论。

 本地终点为 `work-unit.strategic-design-handoff`，完成后 `next_route: null`；本仓不生成技术设计、OpenAPI、父/垂直切片 Ticket、Slice Implementation Contract 或运行时代码，实施请求转交下游研发 Profile。

## 来源

- `AGENTS.md:91-101`：本页路由、授权及完成边界依据当前入口的 ## 10. 审查、验证与 Git。
- `AGENTS.md:93-93`：命中产品审查使用独立 Reviewer，实施者不自审；模板日常 self-check 消费维护规则。
- `AGENTS.md:94-95`：Fresh Verification 证明当前范围的真实验证；同边界输入/schema/参数/仓根不变可复用，变化只失效受影响依赖，正式边界重验且不声明实现可合并或发布。
- `AGENTS.md:64-65`：Design 本地禁止 Tactical Design、OpenAPI、父/垂直切片 Ticket、Slice 合同和运行时代码；实施 blocked 转交下游，战略交接完成 next_route 必须 null。
- `.template-spec/process/harness-process-tailoring.md:1-16`：裁剪按实际影响与最近可信阶段，正式业务实现要求当前 Slice；所有路径遵守写范围。
- `.template-source/process/maintenance-intensity.yaml:1-29`：强度按 L1/L2/L3 的已登记 trigger 判定，默认 L2，不定义独立审查授权。
- `CONTEXT.md:1-15`：根 Context 持有稳定业务语言与消费约定，正文不能授予实现权限。
