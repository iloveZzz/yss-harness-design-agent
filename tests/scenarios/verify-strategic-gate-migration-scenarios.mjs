#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { applyStrategicGateMigration, findStrategicGateMigrationIssues, inspectStrategicGateMigration } from '../../scripts/lib/strategic-gate-migration.mjs';

const temp = mkdtempSync(path.join(tmpdir(), 'strategic-gate-migration-'));
const put = (root, ref, value) => { const file = path.join(root, ref); mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`); return file; };
const oldCheckpoint = (workRoot) => ({ repository_mode: 'project-instance', status: 'routing', gates: {
  'gate.domain-strategy-approved': { status: 'approved', approval_ref: `${workRoot}/demo/domain-approval.json`, subject_ref: `${workRoot}/demo/plan.md`, evidence_refs: [`${workRoot}/demo/domain-approval.json`] },
  'gate.stage-decision-package-approved': { status: 'approved', approval_ref: `${workRoot}/demo/stage-approval.json`, subject_ref: `${workRoot}/demo/plan.md`, evidence_refs: [`${workRoot}/demo/stage-approval.json`] },
  'gate.spec-baseline-approved': { status: 'approved', approval_ref: `${workRoot}/demo/spec-approval.json` },
  'gate.user-confirmation': { status: 'approved', approval_ref: `${workRoot}/demo/ui-approval.json`, evidence_refs: [`${workRoot}/demo/prototype.html`] },
  'gate.strategic-design-handoff-approved': { status: 'approved', approval_ref: `${workRoot}/demo/handoff-approval.json` }
}, blockers: [] });
function fixture(root, workRoot) {
  put(root, '.template-spec/agents/issue-tracker.md', `---\ntracker:\n  platform: local-markdown\n  root: ${workRoot}\n---\n`);
  put(root, `${workRoot}/demo/checkpoint.json`, oldCheckpoint(workRoot));
  put(root, `${workRoot}/demo/plan-review.json`, { schema_version: 1, kind: 'plan-entry-review', feature_id: 'demo', gates: { 'gate.domain-strategy-approved': { status: 'approved', approval_ref: `${workRoot}/demo/domain-approval.json`, evidence_refs: [`${workRoot}/demo/plan.md`] } } });
  put(root, `${workRoot}/demo/domain-approval.json`, { schema_version: 1, gate_id: 'gate.domain-strategy-approved', decision: 'approved', actor_kind: 'digital-human' });
  put(root, `${workRoot}/demo/plan.md`, 'plan');
  put(root, 'docs/deliveries/strategic/demo/v1/delivery.json', { gate_id: 'gate.domain-strategy-approved' });
}

try {
 for (const workRoot of ['.work', 'docs/custom-work', 'docs/.scratch']) {
  const project = path.join(temp, workRoot.replaceAll('/', '-'), 'project'); fixture(project, workRoot);
  const checkpoint = path.join(project, `${workRoot}/demo/checkpoint.json`);
  const before = readFileSync(checkpoint);
  const frozen = readFileSync(path.join(project, 'docs/deliveries/strategic/demo/v1/delivery.json'));
  const plan = inspectStrategicGateMigration({ root: project, feature: 'demo' });
  assert.equal(readFileSync(checkpoint).equals(before), true, '计划生成必须零写入');
  assert.deepEqual(plan.blockers, []);
  assert.deepEqual(plan.reapproval_required, ['gate.plan-approved', 'gate.product-design-approved', 'gate.spec-baseline-approved']);
  assert.equal(plan.historical_evidence.length, 1);
  assert.equal(findStrategicGateMigrationIssues({ root: project }).length > 0, true);
  assert.equal(applyStrategicGateMigration(plan, { root: project }).result, 'applied');
  assert.equal(applyStrategicGateMigration(plan, { root: project }).result, 'already-applied');
  const migrated = JSON.parse(readFileSync(checkpoint, 'utf8'));
  assert.equal(migrated.gates['gate.plan-approved'].status, 'ready-for-human');
  assert.equal(migrated.gates['gate.spec-baseline-approved'].status, 'ready-for-human');
  assert.equal(migrated.gates['gate.product-design-approved'].status, 'ready-for-human');
  assert.equal(migrated.gates['gate.strategic-design-handoff-approved'].status, 'stale');
  assert.equal(migrated.checks['check.domain-strategy-approved'].historical_approval_ref.endsWith('domain-approval.json'), true);
  assert.equal(readFileSync(path.join(project, `${workRoot}/demo/domain-approval.json`), 'utf8').includes('gate.domain-strategy-approved'), true);
  assert.equal(readFileSync(path.join(project, 'docs/deliveries/strategic/demo/v1/delivery.json')).equals(frozen), true);
  assert.deepEqual(findStrategicGateMigrationIssues({ root: project }), []);

  const drift = path.join(temp, workRoot.replaceAll('/', '-'), 'drift'); fixture(drift, workRoot); const driftPlan = inspectStrategicGateMigration({ root: drift });
  writeFileSync(path.join(drift, `${workRoot}/demo/plan.md`), 'changed');
  const driftBefore = readFileSync(path.join(drift, `${workRoot}/demo/checkpoint.json`));
  assert.throws(() => applyStrategicGateMigration(driftPlan, { root: drift }), /输入摘要漂移/);
  assert.equal(readFileSync(path.join(drift, `${workRoot}/demo/checkpoint.json`)).equals(driftBefore), true, '漂移失败必须原子保持');

  const unknown = path.join(temp, workRoot.replaceAll('/', '-'), 'unknown'); fixture(unknown, workRoot); const value = oldCheckpoint(workRoot); value.gates['gate.unknown-old'] = { status: 'approved' };
  put(unknown, `${workRoot}/demo/checkpoint.json`, value);
  const unknownPlan = inspectStrategicGateMigration({ root: unknown });
  assert.match(unknownPlan.blockers.join('\n'), /未知 gate/);
  assert.throws(() => applyStrategicGateMigration(unknownPlan, { root: unknown }), /存在阻塞/);

  const duplicate = path.join(temp, workRoot.replaceAll('/', '-'), 'duplicate'); fixture(duplicate, workRoot); const duplicateValue = oldCheckpoint(workRoot); duplicateValue.checks = { 'check.domain-strategy-approved': { status: 'passed' } };
  put(duplicate, `${workRoot}/demo/checkpoint.json`, duplicateValue);
  assert.match(inspectStrategicGateMigration({ root: duplicate }).blockers.join('\n'), /重复迁移目标/);
  const configDrift = path.join(temp, 'config-drift-' + workRoot.replaceAll('/', '-')); fixture(configDrift, workRoot);
  const configPlan = inspectStrategicGateMigration({ root: configDrift });
  put(configDrift, '.template-spec/agents/issue-tracker.md', '---\ntracker:\n  platform: local-markdown\n  root: changed-work\n---\n');
  assert.throws(() => applyStrategicGateMigration(configPlan, { root: configDrift }), /输入摘要漂移/);
  assert.equal(JSON.parse(readFileSync(path.join(configDrift, workRoot, 'demo/checkpoint.json'))).gates['gate.domain-strategy-approved'].status, 'approved');
  console.log('战略门禁迁移场景通过：零写入、摘要漂移、原子失败、幂等、未知 ID、历史保留和重新确认');
 }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
