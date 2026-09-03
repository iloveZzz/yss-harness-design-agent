# `yss-research` 同步 L3 GREEN

修订后定向检查：

- `node .agents/skills/yss-research/tests/run-scenarios.mjs`：exit `0`，7 个场景通过。
- `pnpm --dir .codex/skills/product-design run research:test`：exit `0`，5 个场景通过。
- `scripts/verify-skill-registry`：exit `0`，21 个共享技能、1 个平台技能通过。
- `scripts/verify-digital-human-roles`：exit `0`，3 个角色、5 个协作组、3 个运行时通过。
- `scripts/verify-lifecycle-scenarios`：exit `0`。
- `scripts/verify-harness-profile-scenarios`：exit `0`。
- `scripts/verify-matt-yss-integration-scenarios`：exit `0`。
- `scripts/sync-skills --check` 与 `scripts/update-skill-lock --check`：exit `0`。

结果覆盖共享证据合同、Product Design 研究包、技能身份、战略路由、数字人消费方及平台投影。
