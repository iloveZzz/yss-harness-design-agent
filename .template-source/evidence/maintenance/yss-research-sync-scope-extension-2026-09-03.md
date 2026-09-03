# `yss-research` 同步范围扩展依据

本次同步按用户“全部应用推荐”和“同步给战略设计子项目”的授权执行 L3 完整模板门禁。首次运行 `scripts/verify-template` 时，`verify-matt-yss-integration-scenarios` 暴露三项既有场景合同与当前权威合同不一致；若不修复，战略设计子项目无法形成可提交的 fresh verification。

## 必要修复

1. 场景检查的 model-invoked 技能集合遗漏当前合同已经引用的 `code-review`，生命周期允许集合遗漏 Discovery 已登记的 `competitive-intelligence`。
2. Strategic Design Handoff 已在合同中声明人工确认，但场景预期集合没有包含该门禁。
3. profile-specific transition 场景 fixture 未填写 `profile_id`，导致验证器不能按声明的 Harness Profile 判断合法 next route。

这些改动只让确定性场景与现有权威合同对齐，不新增产品行为、生命周期阶段或对外接口；它们是完成本次同步所需的门禁修复，不是独立功能扩张。修复后完整 `scripts/verify-template` 才能通过。该范围扩展由本轮“全部应用推荐”和“完成后统一提交”覆盖，并纳入新的不可变候选与双轴独立复审。
