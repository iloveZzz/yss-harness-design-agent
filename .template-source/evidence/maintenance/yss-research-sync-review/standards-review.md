# Standards Review

- 候选 digest：`ba861a06bce14fb1f98160c76deb01398e284562bb663a72638e3e5c1753aa53`；packed 检查及 live 重算匹配。覆盖 canonical/projection/lock、生命周期所有权、alias、跨仓边界、validator 与 smell。
- IMPORTANT：`evidence-contract.md:36` 规定 decision-bearing claim 为 `unsupported` 时验证失败；`validate-research-package.mjs:103-118` 却在 disposition=`needs-deeper-research` 时放行。实测反例 exit `0`，不能作为战略门禁可靠前置。
- IMPORTANT：`orchestration-contract.yaml:242-249` 的 `work-unit.stage-decision` 未接入 `yss-research/research_contract`；场景仅检查 domain-strategy（`scenario-checks.mjs:63-64`），无法确定性保证 `gate.stage-decision-package-approved` 前使用 `strategy-evidence/evidence-audited`。
- 判断性风险：registry 声明 `research` alias，但 governance 实测“0 个兼容 alias”，兼容调用无行为证明；两套 validator 有 Duplicated Code/漂移风险。其余散布修改属原子迁移/投影所需。
- 验证：任务包三命令及 registry/governance、lifecycle、entry、roles、profile、Matt/YSS、Product Design scenarios 均 exit `0`；违规反例 exit `0`（应非零）。

结论：**FAIL（Standards）**；修复后重捕候选并复审，不批准发布。
