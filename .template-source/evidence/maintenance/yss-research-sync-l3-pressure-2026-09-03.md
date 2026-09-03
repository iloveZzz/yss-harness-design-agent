# `yss-research` 同步 L3 压力场景

共享 validator 覆盖并拒绝：

- 战略决策 claim 伪装成 non-decision-bearing；
- unsupported claim 仍标记 publish；
- counter-signal 引用并非 `none-found` 搜索；
- 技术决策 claim 没有 primary evidence；
- `lead-only` 证据被用作支持；
- 决策 claim 未进入 audit summary。

Product Design validator 覆盖并拒绝：

- unsupported claim 发布；
- evidence reference 不可解析；
- 假 counter-signal；
- 高严重度问题缺少 problem / impact / frequency / recommended-move 四类审计 claim。

供应链同时检查旧 canonical / projection 被清理、新投影一致、锁文件 hash 与 source provenance 当前。
