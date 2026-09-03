# 战略设计子项目 `yss-research` 同步研究记录

日期：2026-09-03  
范围：共享研究技能、Product Design UX research、Discovery / DDD 战略设计路由及技能供应链。

## 观察事实

- 本仓是 `repository_mode: template-source`，本轮只维护模板技能、路由、投影和验证证据，不生成具体产品资产。
- 原 canonical `.agents/skills/research` 只要求后台 Agent、一手资料和单 Markdown 结果，没有 profile、搜索日志、证据台账、反证、claim-source audit 或战略资产所有权边界。
- `research` 被 `yss-strategic-design`、`yss-stage-decision`、数字人角色、Matt 适配和平台投影共同消费，改名必须原子同步。
- Product Design 内置 `research` 面向 UX 摩擦扫描，与技术 / 战略事实研究职责不同；应共享证据词汇，但保留独立工作流和校验器。
- [Academic Research Skills](https://github.com/Imbad0202/academic-research-skills) 的 Material Passport、系统化搜索、来源验证和 claim-to-reference alignment 可复用；论文写作、投稿、固定 Agent 团队和跨模型审稿超出本仓范围。

## 已采纳设计

- canonical 改为 `yss-research`，`research` 保留 deprecated alias。
- 提供 `technical-evidence` / `strategy-evidence` profile 与 `quick` / `evidence-audited` mode。
- 决策性技术主张要求 primary source；战略证据允许 direct-experience / near-primary，但必须披露样本、时效和访问限制。
- 战略决策证据进入 `gate.domain-strategy-approved` 或 `gate.stage-decision-package-approved` 前必须通过审计研究包校验。
- 研究只提供证据；`domain-modeling`、`yss-stage-decision` 和 `yss-strategic-design` 继续拥有下游资产及门禁。

## 边界与风险

- `competitive-intelligence` 继续负责竞品、定价、市场定位和口碑事实；`product-design:research` 继续负责 UX / workflow friction。
- 后台 Agent 是吞吐优化，不是可信度证明；不可用时允许当前 Agent 执行研究。
- JSON-compatible YAML 牺牲少量手写可读性，换取无依赖、确定性校验。
- `create-yss-harness-design` 的已发布快照不在本轮提交范围；兼容 alias 用于跨仓迁移窗口。

## 结论

同步本体的 `yss-research` 合同、Product Design evidence-audited 能力及战略门禁接线，并保留战略设计 profile 的本地终点和资产所有权边界。
