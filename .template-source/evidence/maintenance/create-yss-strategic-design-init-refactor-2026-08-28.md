# 战略设计实例 CLI 重构记录

1. 实例分发清单放在 `docs/process/instance-distribution-manifest.yaml`，CLI `template.manifest.json` 由 `toCliManifest()` 投影，避免两套 allow/deny。
2. `scripts/lib/instance-distribution.mjs` 同时服务 `verify-template` 和 CLI sync-template，匹配规则只维护一处。
3. `node-verify-lifecycle-registry.mjs` 把 `yss-public-skills.json` 和全生命周期用户指南检查限制在 `template-source`，使 `project-instance` 可以跑同一套 `scripts/verify-template`。
4. CLI v1 只保留 `init`；`attach` / `sync` 显式拒绝，避免半套冲突算法。
