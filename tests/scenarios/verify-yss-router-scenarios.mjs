#!/usr/bin/env node
import { runScenario } from "../../scripts/lib/scenario-checks.mjs";
import { fixtureFile, verifyFixtureSource } from "../fixtures/canonical-source.mjs";
import inventory from "../fixtures/upstream-source-index.mjs";
verifyFixtureSource();
const testAssets=new Map(inventory.files.map(row=>[row.path,fixtureFile(row.path)]));
try { runScenario("router", {testAssets}); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { parseDocument } from "../../scripts/vendor/yaml.mjs";
const profile=parseDocument(readFileSync(new URL("../../.template-spec/process/harness-profile.yaml",import.meta.url),"utf8")).toJS();
assert.equal(profile.lifecycle.terminal_work_unit,"work-unit.strategic-design-handoff");
assert.ok(profile.lifecycle.forbidden_work_units.includes("work-unit.slice-implementation"));
assert.equal(existsSync(new URL("../../.agents/skills/yss-router",import.meta.url)),false);
assert.ok(!inventory.files.some(row=>row.path.includes("/yss-router/")));

import {compileImplementationContract,loadCompilerContract} from '../fixtures/upstream-source/scripts/lib/implementation-contract-compiler.mjs';
import {loadSkillRegistry} from '../fixtures/upstream-source/scripts/lib/skill-registry.mjs';
const registry=loadSkillRegistry(),compilerContract=loadCompilerContract();
const identity={architecture_family:'domain-driven',architecture_profile:'target-domain-model',generator_skill:'yss-ddd-scaffold-generator',requested_capabilities:[],resolved_modules:['domain','application','infrastructure','adapter','bootstrap'],verification_database:'h2',production_database:'not-bound',contract_digest:'a'.repeat(64)};
const input={registry,compilerContract,architecture_identity:identity,architecture_evidence:{engineering_baseline:identity,repository_registration:identity,manifest:identity},compiledAt:'2026-10-06T00:00:00.000Z'};
assert.throws(()=>compileImplementationContract({...input,recipeIds:['yss-router']}),/已移除 skill id/);
const result=compileImplementationContract({...input,recipeIds:['backend.ddd-domain-behavior']});
assert.ok(result.required_skills.includes('yss-domain'));
