# Matt技能体系

Matt Engineering Skills 提供澄清、文档、诊断、TDD、审查与架构方法，不能替代 YSS 专项规则、仓库身份或生命周期批准。锁定来源以当前 skills-lock.json 为准，不复制 README 的历史 revision。

技术事实用 yss-research，竞品事实用 competitive-intelligence；问题先调查可复现行为，业务实施消费适用 YSS 技术技能。文档按 writing-for-agents 和 i-have-adhd 当前写入范围组织。

先消费本地 `yss-strategic-design/references/orchestration-contract.yaml` 的 `request_triage.delivery_path`，再按 Harness Profile 的允许工作单元推进。Design 未启用日常实现，不因小改动获得实现权限。

旧入口只作历史识别，当前支持项及替代路径以 Skill 迁移说明、注册表和锁文件为准；工具调用成功不等于获得正式批准或外部 Git 权限。参见 [[Agent入口规则]]、[[YSS工程技能体系]]。

## 来源

- `AGENTS.md:80-86`：本页路由、授权及完成边界依据当前入口的 ## 8. 专项入口。
- `AGENTS.md:82-82`：技术事实使用 yss-research，竞品与市场或用户口碑事实使用 competitive-intelligence。
- `AGENTS.md:58-58`：Design 消费本地 yss-strategic-design orchestration-contract 的 request_triage.delivery_path；本 Profile 未启用日常实现，只执行 allowed_work_units。
- `AGENTS.md:99-100`：授权消费本地 yss-strategic-design user-decisions；有效范围授权复用，commit/push/publish 分别核验用户授权；返工或重要缺陷触发中文复盘。
- `CONTEXT.md:1-15`：根 Context 持有稳定业务语言与消费约定，正文不能授予实现权限。
- `.template-source/agents/skills-maintenance.md:5-13`：共享内容、平台专属来源、投影与锁各按其事实所有权维护。
- `skills-lock.json:1-12`：当前锁的版本、canonicalRoot 与来源元数据是技能来源记录；名称摘录是派生视图。
