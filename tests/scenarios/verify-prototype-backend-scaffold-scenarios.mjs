#!/usr/bin/env node
import { runScenario } from "../helpers/scenario-checks.mjs";
import { fixtureFile, verifyFixtureSource } from "../fixtures/canonical-source.mjs";
import inventory from "../fixtures/upstream-source-index.mjs";
verifyFixtureSource();
const testAssets=new Map(inventory.files.map(row=>[row.path,fixtureFile(row.path)]));
try { runScenario("prototype", {testAssets}); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { parseDocument } from "../../scripts/vendor/yaml.mjs";
const profile=parseDocument(readFileSync(new URL("../../.template-spec/process/harness-profile.yaml",import.meta.url),"utf8")).toJS();
assert.equal(profile.lifecycle.terminal_work_unit,"work-unit.strategic-design-handoff");
assert.ok(profile.lifecycle.forbidden_work_units.includes("work-unit.slice-implementation"));
assert.equal(existsSync(new URL("../../.agents/skills/yss-router",import.meta.url)),false);
assert.ok(!inventory.files.some(row=>row.path.includes("/yss-router/")));
