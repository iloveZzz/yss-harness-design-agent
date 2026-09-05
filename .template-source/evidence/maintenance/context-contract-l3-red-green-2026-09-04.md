# 战略设计 CONTEXT.md 合同 L3 RED / GREEN 记录

日期：2026-09-04
范围：战略设计模板、领域战略/阶段决策、战略交接、目标项目上下文回流与 CLI

## RED

- 阶段决策 schema v2 场景要求 `context_snapshot` 后，旧验证器不能接受新合同，暴露原先仅引用文件路径、无法校验术语集与文档版本的问题。
- `context_reconciliation` 与战略交接上下文场景在实现前没有公开入口；按缺少入口失败建立场景，证明批准、`next_route` 和 handoff 之前没有持久化上下文对账。
- 主模板聚合验证首次发现战略技能来源 hash 漂移并阻断，证明战略源仓变化不会被陈旧投影静默吸收。

## GREEN

- 战略项目只允许 Git 根目录有一个大小写严格的 `CONTEXT.md`，并使用与主模板相同的 schema、表格、英文标识、Context 边界和稳定术语引用规则。
- 领域战略与阶段决策 schema v2 绑定全文摘要和引用术语摘要；v1 保持只读并返回 `migration-required`。
- 战略交接 schema v2 输出来源 `context_snapshot` 和完整 `context_delta`；目标项目必须先合并根目录 `CONTEXT.md` 并完成 `context_reconciliation`，才能启动战术设计。

## Fresh verification

以下命令均在本轮实际通过：

```text
scripts/verify-template-fast
cd ../create-yss-strategic-design && npm test
```

`verify-template-fast` 因核心治理资产变化自动提升并完成 release profile。该结果只证明当前工作树通过完整机器门禁，不等于已提交、推送或发布。

## REFACTOR 与压力场景

- 上下文解析与双摘要集中到共享验证逻辑，阶段决策、生命周期 checkpoint 和 handoff 复用同一语义。
- 负向场景覆盖根目录错误、嵌套副本、摘要漂移、旧 schema、伪锚点、未对账增量和目标术语不一致。
- 权威技能、Agent 投影、技能锁、生命周期注册表及派生阅读视图已同步校验。

## 当前边界

本轮仅达到战略设计源仓 `implementation-ready`。没有 Git commit、push、候选冻结或发布动作。
