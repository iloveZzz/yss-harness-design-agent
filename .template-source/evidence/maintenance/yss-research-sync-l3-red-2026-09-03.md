# `yss-research` 同步 L3 RED

基线命令：

```bash
baseline_name="$(git show HEAD:.agents/skills/research/SKILL.md | sed -n '2p')"
baseline_route="$(git show HEAD:.agents/skills/yss-strategic-design/references/orchestration-contract.yaml | rg 'technical_or_standard_fact' | head -n 1)"
test "$baseline_name" = "name: yss-research"
```

实际结果：exit `1`。

- `baseline_name=name: research`
- `baseline_route` 将 `technical_or_standard_fact` 路由到 `research`，且没有 `strategy_fact` 或 `evidence-audited` 合同。

该反例证明旧基线无法满足 canonical rename 和战略证据审计要求。
