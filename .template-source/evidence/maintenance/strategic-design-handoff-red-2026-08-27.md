# Strategic Design Handoff L3 RED 证据

变更前的最小反例是：`stage-decision` 只能继续 `work-unit.spec-synthesis`，无法以业务上游 profile 的终止路由交付给下游；因此 profile-aware `next_route: null` 场景在旧实现中不成立。

本轮通过 `scripts/verify-lifecycle-transition-scenarios` 增加该反例后，再实现 profile-aware 路由以闭合 RED。
