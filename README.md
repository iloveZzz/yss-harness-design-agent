# YSS Strategic Design Harness

> 面向产品、需求、商务的业务上游战略设计 Harness（`harness.business-ddd-strategy-handoff`）。本地生命周期在 Strategic Design Handoff 结束，不进入 OpenAPI、Tactical DDD、垂直切片实现或发布。

## 定位

本模板默认作为战略设计 / 研发管理仓库，保留 Discovery、Spec、原型、业务级 Ticket、战略设计交付包、Agent skills 和协作约定。OpenAPI、实现仓库和运行时代码由下游研发 profile 接管。

## 项目结构

```text
├── .agents/                 ← 跨 Agent 共享 skills 的权威内容
├── .claude/                 ← Claude skills 投影与平台专属 skills
├── .codex/                  ← Codex skills 投影与平台专属 skills
├── .cursor/                 ← Cursor skills 投影
├── .hermes/                 ← Hermes skills 投影与平台专属 skills
├── .pi/                     ← Pi skills 投影与平台专属 skills
├── .qoder/                  ← Qoder skills 投影与平台专属 skills
├── .trae/                   ← Trae skills 投影与平台专属 skills
├── AGENTS.md                ← AI 指令
├── CONTEXT.md               ← 领域词汇表
├── yss-project.yaml         ← 仓库身份清单
├── docs/
│   ├── api/                 ← OpenAPI 3.1 契约
│   ├── adr/                 ← 架构决策记录
│   ├── requirements/        ← Spec / 用户故事 / 需求草案 / 垂直切片
│   ├── discovery/           ← 机会探索、市场、竞品和用户材料
│   ├── design/              ← 产品设计、原型、交互说明和状态矩阵
│   ├── architecture/        ← 架构设计与审查模板
│   ├── releases/            ← 发布说明
│   ├── implementation/      ← 实施方案、上线记录和回滚方案
│   ├── testing/             ← 测试策略和验证记录
│   ├── agents/              ← Agent 协作规范、Ticket/Triage/领域文档约定
│   ├── templates/           ← 通用文档模板
│   └── process/             ← 生命周期、裁剪、Scrum 和技能治理说明
└── scripts/                 ← 模板轻量校验脚本
```

项目需要生成度量或其他临时产物时再按需创建对应目录。`docs/api/`、`docs/implementation/`、`docs/testing/` 等目录保留为下游研发模板兼容资产，不是本 profile 的本地主链。

## Quickstart

1. 先读取 `yss-project.yaml`，按 `repository_mode` 选择模板维护或 `harness.business-ddd-strategy-handoff` 产品战略设计流程。
2. 必读入口为 `AGENTS.md` 与 `CONTEXT.md`；本地职责边界以 `docs/process/harness-profile.yaml` 为准，生命周期 ID 以 `docs/process/lifecycle-registry.yaml` 为准。
3. `template-source` 修改流程、技能或模板后，执行 `scripts/sync-skills`、`scripts/update-skill-lock` 和 `scripts/verify-template`。
4. `project-instance` 使用 `yss-strategic-design`：机会调研 → Spec → 页面原型 → 业务级 Ticket → `work-unit.strategic-design-handoff`。不要在本地拆垂直切片或进入实现。
5. OpenAPI、Tactical DDD、实现仓库和覆盖率门禁属于下游研发 profile，不是本仓硬门禁。

YSS skills 的公开发布投影维护在 [iloveZzz/yss-spec-dev-skills](https://github.com/iloveZzz/yss-spec-dev-skills)，发布清单和导出命令见 [skills 维护说明](./docs/agents/skills-maintenance.md)。

## 模板初始化 CLI

`create-yss-spec` 的目标维护位置是独立 GitHub 仓库 [iloveZzz/create-yss-spec](https://github.com/iloveZzz/create-yss-spec)。本仓库不再包含 CLI 源码、测试、发布配置或开发过程记录，只保留面向模板使用者的实践指南：

- [create-yss-spec 外部 CLI 实践指南](./docs/user-guide/外部命令行工具实践指南.md)

推荐入口：

```bash
npm create yss-spec@latest
```

首次使用前请先确认独立仓库和 npm 包已完成发布。

## 模板配置取舍

`.agents/skills` 是共享技能的权威内容；其他 Agent root 只保存同步投影和平台专属技能。共享技能只能在权威目录修改，随后运行：

```bash
scripts/sync-skills
scripts/update-skill-lock
```

Matt skills 固定来源：

```text
mattpocock/skills
main@6acc160e4e0cd062dbbbd7a1b26ae92855edf07e
```

主研发流程使用 `skills/engineering`；`skills-lock.json` 同时记录本次安装的关联 `productivity`、`in-progress`、`deprecated`、`misc` 和 `personal` skill 路径。

## 轻量校验

```bash
scripts/verify-template
```

该脚本检查：

- `yss-project.yaml`、权威流程资产和模板是否完整。
- 共享技能投影及 `skills-lock.json` 的完整树哈希是否一致。
- 过时技能、路径和规范用语是否已清理。
- 五类流程压力场景是否符合条件门禁和仓库身份路由。
- Markdown 相对链接是否指向现有文件。
- 示例 OpenAPI YAML 是否可解析。
- Git diff 是否存在空白错误。

## 关键文档

| 文档 | 内容 |
|------|------|
| [AGENTS.md](./AGENTS.md) | 仓库身份路由、战略设计硬门禁与禁止事项 |
| [docs/user-guide/用户手册索引.md](./docs/user-guide/用户手册索引.md) | 模板使用说明 |
| [docs/user-guide/产品生命周期工作流.md](./docs/user-guide/产品生命周期工作流.md) | 产品全生命周期使用手册 |
| [docs/user-guide/图示生成器使用指南.md](./docs/user-guide/图示生成器使用指南.md) | Excalidraw 可视化辅助 skill 使用手册 |
| [docs/process/PDCA-SCRUM.md](./docs/process/PDCA-SCRUM.md) | PDCA × Scrum × AI |
| [docs/process/MATT-POCOCK-ENGINEERING-SKILLS.md](./docs/process/MATT-POCOCK-ENGINEERING-SKILLS.md) | Matt Pocock Engineering Skills 集成与使用 |
| [docs/process/lifecycle-registry.yaml](./docs/process/lifecycle-registry.yaml) | 生命周期结构事实源：主阶段、门禁、产物、工作单元、证据与稳定 ID |
| [docs/process/harness-process-tailoring.md](./docs/process/harness-process-tailoring.md) | 小改动 / 中等变更 / 新模块的流程裁剪指南 |
| [docs/process/harness-executive-blueprint.md](./docs/process/harness-executive-blueprint.md) | 面向业务方和管理者的 Harness 一页式蓝图 |
| [docs/process/implementation-repo-integration.md](./docs/process/implementation-repo-integration.md) | 外部前端 / 后端实现仓库接入与跨仓库切片绑定 |
| [docs/agents/README.md](./docs/agents/README.md) | Agent 协作文档目录说明 |
| [docs/agents/skills-maintenance.md](./docs/agents/skills-maintenance.md) | Agent skills 安装与维护 |
| [docs/user-guide/规格与任务迁移指南.md](./docs/user-guide/规格与任务迁移指南.md) | 旧规格与任务入口迁移指南 |
| [docs/discovery/IDEATION.md](./docs/discovery/IDEATION.md) | 机会构想方法 |
| [docs/architecture/README.md](./docs/architecture/README.md) | 架构设计 + 审查清单 |
| [docs/testing/README.md](./docs/testing/README.md) | 测试策略 |

## 核心模板

| 模板 | 用途 |
|------|------|
| [docs/templates/spec-template.md](./docs/templates/spec-template.md) | Spec，包含 OpenAPI 影响、测试决策、AI / 人工审查点 |
| [docs/templates/local-parent-ticket-template.md](./docs/templates/local-parent-ticket-template.md) | Local Markdown 功能父 Ticket 与生命周期索引 |
| [docs/templates/vertical-slice-ticket-template.md](./docs/templates/vertical-slice-ticket-template.md) | 垂直切片 Ticket |
| [docs/templates/agent-brief-template.md](./docs/templates/agent-brief-template.md) | `triage` 产出的 Agent Brief |
| [docs/templates/implementation-repo-registry-template.md](./docs/templates/implementation-repo-registry-template.md) | 外部实现仓库登记 |
| [docs/templates/cross-repo-slice-template.md](./docs/templates/cross-repo-slice-template.md) | 跨仓库垂直切片记录 |
| [docs/architecture/templates/architecture-deepening-template.md](./docs/architecture/templates/architecture-deepening-template.md) | 架构 deepening 候选与 seam 设计 |
