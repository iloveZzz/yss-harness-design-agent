# i-have-adhd 接入验证记录

维护强度：L3；当前仅来源工作树达到 implementation-ready，尚未提交，生成器固定快照未闭合。

## 影响与边界

安装固定上游的 YSS 适配技能、共用中文规范和示例，接入本仓既有文档调用者及编排器。注册表、来源锁和投影同步更新；保留本仓原有 profile、阶段、角色和批准职责。跨仓分发依赖本仓固定提交后再生成对应工具快照。

## 实际核验

| 命令 | 退出码 | 证据 |
|---|---|---|
| `scripts/verify-template-fast` | 0 | `fast-verified.log` |
| `node .agents/skills/i-have-adhd/tests/verify-integration.mjs` | 0 | `integration-verified.log` |
| `git diff --check` | 0 | 本轮执行，无输出 |

## 维护者自检

技能按当前文档条件加载，不保留会话模式。本仓无实现编译器，检查战略编排合同及条件依赖。

注册表要求默认可发现技能使用 core 层，适配技能据此登记为通用工作流配套；它不拥有生命周期。空 overrides 映射及不同编排合同版本已按各仓结构处理并重新核验；派生文件由现有脚本生成。

Plan / Spec / Ticket 作者构造示例保留未确认收益、七条规则、多个阻塞、冻结引用及未执行验证。未知原因必须保持未知属于技能合同要求。本轮属于结构、依赖解析和作者保真自检，未执行模型效果实验或独立盲评。

context_reconciliation: not-applicable；本仓身份为 template-source，只维护模板合同，没有产品工作单元。业务 behavior-tdd: not-applicable；本轮修改技能、文档和元数据，使用上述可执行结构与依赖验证。
