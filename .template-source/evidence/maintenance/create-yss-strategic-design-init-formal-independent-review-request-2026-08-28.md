# create-yss-strategic-design init 正式独立审查请求

## 审查范围

- 本仓实例分发清单、`AGENTS.md` profile 路由、用户指南与 `create-yss-spec` 解绑。
- 独立 CLI `create-yss-strategic-design` 的空目录 `init`：身份转换、profile 裁剪、metadata、post-init `scripts/verify-template`。
- 跨仓契约 `.template-source/contracts/create-yss-strategic-design-init-contract.md`。

## 实施者不得关闭的问题

1. 生成实例是否仍可能把 Agent 送进 OpenAPI / `yss-router` / 垂直切片实现。
2. 分发清单是否漏登禁止路径，或误删 Strategic Design Handoff 所需资产。
3. 是否把本仓发布错误绑定到 `create-yss-spec`。

## 已执行验证（实施者）

| 命令 | 结果 |
|---|---|
| `scripts/verify-instance-distribution` | 通过 |
| `scripts/verify-instance-distribution-scenarios` | 通过 |
| `scripts/verify-harness-profile` / `scripts/verify-harness-profile-scenarios` | 通过 |
| `YSS_STRATEGIC_DESIGN_TEMPLATE_REPO=<harness> node --test tests/init-cli.test.js` | 5/5 通过，含实例 `scripts/verify-template` |
| `scripts/verify-template`（本仓 template-source） | **未通过**：`.template-source/scripts/evidence-index --check` 指向父仓 commit `de42d8a9`，本仓 Git 历史没有该对象。这是 fork 既有问题，本轮未修复。 |

## 结论

实施者不能出具正式独立审查结论。合并、`npm publish` 或宣布可发布前，须由非实施者改写本文件并给出 Blocker / Non-blocker。
