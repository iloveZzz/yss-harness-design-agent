# `create-yss-strategic-design` 初始化跨仓库契约

本文定义本模板源仓库与外部 `create-yss-strategic-design` CLI 之间的身份、分发面、初始化和发布契约。

本 harness **不**履行 [create-yss-spec-repository-mode-contract.md](./create-yss-spec-repository-mode-contract.md)。`create-yss-spec` 绑定全生命周期模板 `yss-spec-project-template`，不得用来生成本 profile 的项目实例。

## 契约目标

- 模板源仓库保留 `repository_mode: template-source`。
- CLI 创建的产品仓库写入 `repository_mode: project-instance`。
- 实例绑定 `profileId: harness.business-ddd-strategy-handoff`。
- CLI 只管理实例分发清单声明的研发管理资产，不生成前后端运行时代码，不创建远端 Git、CI 或 Ticket Board。
- 分发清单以 `docs/process/instance-distribution-manifest.yaml` 为单一事实来源；CLI 的 `template.manifest.json` 必须由此文件投影。
- 通过模板快照和 40 位 `templateCommit` 使每次初始化可追踪；运行时不拉取模板仓库。
- 新快照的实例门禁以 Node `>=22 <27` 运行；不得执行 `npm install`、`pnpm install` 或维护侧 vendor 构建。`scripts/vendor/` 必须随快照分发且可离线使用。

## 空目录初始化

```bash
npx create-yss-strategic-design@latest \
  --project-name "项目名称" \
  --business-domain "业务领域" \
  --target-dir "./project" \
  --git-init
```

初始化必须：

1. 只使用当前 CLI 包内置快照。
2. 把 `yss-project.yaml` 转为 `schema_version: 1`、`repository_mode: project-instance`。
3. 写入 `.yss-strategic-design.json`（不得写入 `.yss-template.json`）。
4. 渲染 `AGENTS.md`、`README.md`、`yss-project.yaml`、`docs/agents/issue-tracker.md` 中的项目级字段。
5. 目标非空默认拒绝；`--force` 才覆盖。`--dry-run` 只预览。
6. 空 gitlink / detached HEAD / git-submodule 挂载点 fail closed；`--force` 也不能覆盖。
7. apply 后在实例根执行 `scripts/verify-template`；失败则删除本轮写入。

metadata 至少包含：

```json
{
  "metadataSchemaVersion": 1,
  "templateName": "yss-harness-design-agent",
  "profileId": "harness.business-ddd-strategy-handoff",
  "cliVersion": "<semver>",
  "templateSource": "github:iloveZzz/yss-harness-design-agent",
  "templateCommit": "<40-char-commit>",
  "managedFilesManifestVersion": "<manifest-hash>",
  "variables": {},
  "managedFiles": {}
}
```

v1 不实现 `attach` / `sync`。`managedFiles` 仍须写入，供后续版本使用。

## 实例边界

生成结果必须包含：

- `docs/process/harness-profile.yaml`
- `docs/templates/strategic-design-handoff-template.yaml`
- `.agents/skills/yss-strategic-design/SKILL.md`
- `scripts/verify-template` 主路径实际调用的共享校验入口与 `scripts/vendor/`

生成结果不得包含 `instance_forbidden_paths` 中的任何路径，尤其是：

- `.template-source/`、`.github/`、`wiki/`、根 `package.json`
- OpenAPI / 垂直切片 / 功能父 Ticket / 实现仓接入模板
- `scripts/verify-yss-router-scenarios` 等下游实现校验入口

生命周期注册表保留 forbidden 工作单元的稳定 ID；裁剪发生在分发文件和 `AGENTS.md` 路由，不改已发布 ID。

## 发布顺序

1. 本仓 `scripts/verify-template` 通过。
2. CLI `YSS_STRATEGIC_DESIGN_TEMPLATE_REF=<pinned-commit> npm test` 通过。
3. 解包生成的实例再跑 `scripts/verify-template` 通过。
4. 正式独立审查通过。

任一仓库未完成共同验证时，不得声称 CLI 或模板可发布。v1 不 `npm publish`，直到上述步骤完成。
