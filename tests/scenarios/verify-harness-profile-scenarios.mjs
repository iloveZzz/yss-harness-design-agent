#!/usr/bin/env node
import assert from "node:assert/strict";
import { checkEntryAlignment, loadEntryAlignmentSources } from "../../scripts/lib/entry-alignment.mjs";
import { loadHarnessProfile, validateHarnessProfile, STRATEGIC_PROFILE_ID } from "../../scripts/lib/harness-profile.mjs";

const source = loadHarnessProfile();
const valid = validateHarnessProfile(source);
assert.equal(source.schema_version, 2);
assert.deepEqual(source.handoff.consumer_capabilities, ["backend-technical-design", "frontend-engineering-design", "delivery-coordination"]);
assert.equal(valid.profile_id, STRATEGIC_PROFILE_ID);
assert.equal(valid.cli_package, "yss");
assert.deepEqual(valid.target_user_roles, ["role.product-manager", "role.requirements-manager", "role.business"]);
assert.equal(valid.terminal_work_unit, "work-unit.strategic-design-handoff");
assert.deepEqual(valid.consumer_capabilities, source.handoff.consumer_capabilities);

assert.equal(valid.native_profile, "design");
assert.equal(valid.metadata_file, ".yss.json");
const aligned = loadEntryAlignmentSources();
checkEntryAlignment(aligned);
assert.throws(() => checkEntryAlignment({ ...aligned, agentsText: aligned.agentsText.replaceAll("yss init --profile design", "yss init --profile unknown") }), /原生初始化入口|native/);

const mutations = [
  ["unknown native profile", (candidate) => { candidate.instantiation.native_profile = "unknown"; }, /native_profile/],
  ["foreign native profile", (candidate) => { candidate.instantiation.native_profile = "backend"; }, /native_profile/],
  ["legacy metadata promoted", (candidate) => { candidate.instantiation.metadata_file = ".yss-harness-design.json"; }, /metadata_file/],
  ["foreign template source", (candidate) => { candidate.instantiation.template_source = "github:iloveZzz/yss-harness-foreign-agent"; }, /template_source/],
  ["retired source env", (candidate) => { candidate.instantiation.pin_env = "YSS_HARNESS_TEMPLATE_REF"; }, /pin_env|历史/],
  ["retired creation default", (candidate) => { candidate.instantiation.npm_create = "npm create yss-harness-design@latest"; }, /npm_create|历史/],
  ["legacy source mismatch", (candidate) => { candidate.instantiation.legacy_cli_package = "create-yss-harness-foreign"; }, /legacy_cli_package/],
  ["extra target role", (candidate) => candidate.audience.target_user_roles.push("role.unknown"), /target_user_roles/],
  ["wrong terminal", (candidate) => { candidate.lifecycle.terminal_work_unit = "work-unit.spec-synthesis"; }, /terminal_work_unit|strategic-design-handoff/],
  ["missing coordination route", (candidate) => { candidate.handoff.consumer_capabilities.pop(); }, /consumer_capabilities/],
  ["missing template", (candidate) => { candidate.handoff.package_template = ".template-spec/templates/missing.yaml"; }, /package_template/],
];
for (const [name, mutate, pattern] of mutations) {
  const candidate = structuredClone(source);
  mutate(candidate);
  assert.throws(() => validateHarnessProfile(candidate), pattern, name);
}
process.stdout.write("Harness profile 压力场景验证通过\n");
