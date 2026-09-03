# `yss-research` 同步 Spec 审查

候选 digest：`ba861a06bce14fb1f98160c76deb01398e284562bb663a72638e3e5c1753aa53`（审查前、完成边界重捕获一致）。覆盖 rename、deprecated alias、双 profile/mode、战略门禁、UX audit、所有权、验证与 scope creep；新增研究资产与本体逐字节一致。

## Findings

1. **IMPORTANT（缺失）**：Product Design `SKILL.md:112` 要求低严重度问题有 primary supporting item，但 evidence template 无 `source_level`，validator 仅校验 `stance`；现有 medium/issue 场景仍通过。须补字段、规则及负向测试。
2. **IMPORTANT（scope creep）**：`scripts/lib/scenario-checks.mjs` 额外改变 Strategic Design Handoff 人工确认集合、`profile_id` fixture 和 `code-review` 白名单；研究同步需求未授权这些既有合同修复。须移出候选或补独立需求依据。

## 验证

`pnpm --dir .codex/skills/product-design run research:test` → 0（5）；`scripts/verify-matt-yss-integration-scenarios` → 0；`scripts/verify-skill-registry` → 0（21/1）；`node .agents/skills/yss-research/tests/run-scenarios.mjs` → 0（7）。

## 结论

**FAIL / violation**。其余检查通过。残余风险：现有验证只证明 registry alias 解析，未证明各运行时直接调用 `/research`。
