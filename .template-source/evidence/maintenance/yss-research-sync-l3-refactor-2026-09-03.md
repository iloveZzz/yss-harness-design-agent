# `yss-research` 同步 L3 REFACTOR

- `SKILL.md` 只保留 profile、mode、来源策略、所有权和输出主合同；条件细节放入 `references/evidence-contract.md`。
- 重复结构化产出使用 assets，确定性引用闭合使用独立 validator，避免把脚本逻辑写入提示词。
- Product Design research 只共享证据审计词汇，不并入通用 `yss-research`，保持 UX 与技术 / 战略研究边界。
- 两个 validator 分别守护通用技术 / 战略研究与 UX 研究合同；暂不抽取跨平台共享运行时，避免把 Codex 平台技能反向变成 canonical skill 的运行依赖。共享词汇通过对称的模板字段与各自场景测试防漂移。
- 修复同步时暴露的既有合同不一致：Discovery 的 `competitive-intelligence` 白名单、Strategic Design Handoff 人工确认集合，以及 Matt 场景 fixture 的 profile 绑定。
- `research` 进入 OBSOLETE 投影清理集合，但通过注册表 alias 继续兼容调用；锁文件保留 Matt upstream revision、path 与 hash。
