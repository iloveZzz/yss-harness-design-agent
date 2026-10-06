#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateApprovalRecord, assertCheckpointUserDecisions, assertCheckpointApprovals } from '../../scripts/lib/approval-record.mjs';
import { buildPlanFixture } from '../../scripts/fixtures/user-decision/plan-fixture.mjs';
import { buildDecisionFixture } from '../../scripts/fixtures/user-decision/build-fixture.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const temp = mkdtempSync(path.join(tmpdir(), 'strategic-decisions-'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

// 合成测试依据只服务本场景；当前消费者上下文先于批准记录构造。
function currentReview(directory, boundary, drafter) {
  mkdirSync(directory, { recursive: true });
  const evidenceRef = path.join(directory, 'current-evidence.md');
  const evidence = Buffer.from('本轮合成业务依据 v1\n');
  writeFileSync(evidenceRef, evidence);
  const basis = [{ ref: evidenceRef, digest: sha256(evidence) }];
  const subjectRef = path.join(directory, 'current-review.json');
  const subject = Buffer.from(JSON.stringify({ schema_version: 1, gate_id: boundary, approval_scope: ['feature.demo'], drafter_principal_ref: drafter, basis }));
  writeFileSync(subjectRef, subject);
  return {
    subjectRef, subject, basis,
    expected: { boundary, subject_ref: subjectRef, subject_digest: sha256(subject), approval_scope: ['feature.demo'], basis, drafter_principal_ref: drafter }
  };
}

try {
  const plan=buildPlanFixture(path.join(temp,'controlled-plan'));
  plan.state.gates={'gate.plan-approved':{status:'approved',approval_ref:plan.state.plan_approval_ref}};
  const options={root:plan.root,checkpoint:plan.state,requireApproved:true};
  const currentPlan=()=>JSON.parse(readFileSync(plan.state.plan_approval_ref));
  assert.doesNotThrow(()=>validateApprovalRecord(currentPlan(),options));
  assert.throws(()=>validateApprovalRecord(currentPlan(),{root:plan.root,requireApproved:true}),/APPROVAL_CONTEXT_REQUIRED/);
  const originalPlan=currentPlan();
  const changed={...originalPlan,basis:[]};plan.write(plan.state.plan_approval_ref,changed);
  assert.throws(()=>validateApprovalRecord(changed,options),/APPROVAL_CURRENT_INVALID|当前|basis/);
  plan.write(plan.state.plan_approval_ref,originalPlan);
  const replies=plan.approval.record.responses;plan.approval.record.responses=[];plan.approval.save();
  assert.throws(()=>validateApprovalRecord(originalPlan,options),/user-decision-response-required/);
  plan.approval.record.responses=replies;plan.approval.save();
  plan.write('plan.md','候选范围变更');assert.throws(()=>validateApprovalRecord(originalPlan,options),/依据|stale|当前/);
  for (const [gateId, actor] of [
    ['gate.spec-baseline-approved', { actor_kind: 'digital-human', role_id: 'role.product-manager' }],
    ['gate.product-design-approved', { actor_kind: 'biological-human', role_id: 'role.biological-human' }]
  ]) {
    const directory = path.join(temp, gateId);
    const current = currentReview(directory, gateId, 'test-only:drafter');
    const fixture = buildDecisionFixture(directory, { boundary: gateId, subjectRef: current.subjectRef });
    const record = {
      schema_version: 1, gate_id: gateId, decision: 'approved', ...actor,
      runtime_id: 'runtime.generic', principal_ref: fixture.record.responses[0].principal_ref,
      subject_ref: fixture.requirement.subject_ref, approval_scope: fixture.requirement.scope,
      subject_digest: sha256(current.subject), basis: current.basis,
      user_decision_ref: fixture.ref, drafter_principal_ref: 'test-only:drafter'
    };
    validateApprovalRecord(record, { requireApproved: true, expected: current.expected });
    assert.throws(() => validateApprovalRecord(record, { requireApproved: true }), /APPROVAL_CONTEXT_REQUIRED/, '缺当前消费者上下文不能凭记录自证');
    assert.throws(() => validateApprovalRecord(record, { requireApproved: true, expected: { ...current.expected, basis: [] } }), /APPROVAL_CONTEXT_REQUIRED/, '缺当前依据须拒绝');
    assert.throws(() => validateApprovalRecord({ ...record, basis: [] }, { requireApproved: true, expected: current.expected }), /当前证据摘要/, '批准记录缺依据须拒绝');
    assert.throws(() => validateApprovalRecord({ ...record, user_decision_ref: undefined }, { requireApproved: true, expected: current.expected }), /user-decision/);
    const responses = fixture.record.responses;
    fixture.record.responses = [];
    fixture.save();
    assert.throws(() => validateApprovalRecord(record, { requireApproved: true, expected: current.expected }), /user-decision-response-required/, '没有原始回复不能关闭门禁');
    fixture.record.responses = responses;
    fixture.save();
    const unboundSubject = Buffer.from(JSON.stringify({ schema_version: 1, gate_id: gateId, basis: [] }));
    writeFileSync(current.subjectRef, unboundSubject);
    assert.throws(() => validateApprovalRecord({ ...record, subject_digest: sha256(unboundSubject) }, { requireApproved: true, expected: { ...current.expected, subject_digest: sha256(unboundSubject) } }), /审阅包身份或依据缺失/, '未绑定当前依据的审阅包不能通过');
    writeFileSync(current.subjectRef, current.subject);
  }

  const handoffCurrent = currentReview(path.join(temp, 'handoff'), 'gate.strategic-design-handoff-approved', 'test-only:product-drafter');
  const handoff = {
    schema_version: 1, gate_id: 'gate.strategic-design-handoff-approved', decision: 'approved',
    actor_kind: 'digital-human', role_id: 'role.requirements-manager', runtime_id: 'runtime.generic',
    principal_ref: 'test-only:requirements-reviewer', drafter_role_id: 'role.product-manager',
    drafter_principal_ref: 'test-only:product-drafter', subject_ref: handoffCurrent.subjectRef,
    subject_digest: sha256(handoffCurrent.subject), approval_scope: ['feature.demo'], basis: handoffCurrent.basis
  };
  assert.doesNotThrow(() => validateApprovalRecord(handoff, { requireApproved: true, expected: handoffCurrent.expected }), '交接由独立数字人复核，不要求新的用户回复');
  assert.throws(() => validateApprovalRecord(handoff, { requireApproved: true }), /APPROVAL_CONTEXT_REQUIRED/, '独立交接复核也必须绑定当前消费者上下文');
  assert.throws(() => validateApprovalRecord({ ...handoff, role_id: 'role.product-manager' }, { requireApproved: true, expected: handoffCurrent.expected }), /会签角色|起草者/);

  const historical = { ...handoff, gate_id: 'gate.user-confirmation' };
  const historicalFile = path.join(temp, 'historical.json');
  writeFileSync(historicalFile, JSON.stringify(historical));
  assert.deepEqual(validateApprovalRecord(historical, { history: true }), { bucket: 'history-only', record: historical, execution_authorization: 'not-evaluated' });
  assert.throws(() => validateApprovalRecord(historical, { requireApproved: true }), /未知或已退役门禁/);
  const historyCli = spawnSync(process.execPath, [path.join(root, 'scripts/verify-approval-record'), '--history', historicalFile], { encoding: 'utf8' });
  assert.equal(historyCli.status, 0);
  assert.match(historyCli.stdout, /execution_authorization=not-evaluated/);
  const currentCli = spawnSync(process.execPath, [path.join(root, 'scripts/verify-approval-record'), '--require-approved', historicalFile], { encoding: 'utf8' });
  assert.equal(currentCli.status, 1);
  const mixedCli = spawnSync(process.execPath, [path.join(root, 'scripts/verify-approval-record'), '--history', '--require-approved', historicalFile], { encoding: 'utf8' });
  assert.equal(mixedCli.status, 1);
  assert.match(mixedCli.stderr, /--history 不能用于当前批准校验/);

  const checkpoint = { repository_mode: 'project-instance', mode: 'resume', status: 'routing', gates: {}, artifacts: {} };
  assertCheckpointUserDecisions(checkpoint);
  assert.throws(() => assertCheckpointApprovals({ ...checkpoint, gates: { 'gate.user-confirmation': { status: 'approved' } } }), /未知或已退役门禁/);
  assert.throws(() => assertCheckpointApprovals({ ...checkpoint, gates: { 'gate.user-confirmation': { status: 'approved' } } }, undefined, { history: true }), /未知或已退役门禁/, 'history 选项不得弱化当前 checkpoint 放行边界');
  assert.throws(() => assertCheckpointUserDecisions({ ...checkpoint, status: 'completed', gates: { 'gate.plan-approved': { status: 'approved' } } }), /交接验收|仍有阻塞/);

  console.log('战略用户决定场景通过：当前消费者依据、审阅包与真实回复须绑定，交接独立复核且旧批准仅历史可读');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
