#!/usr/bin/env node
import { runScenario } from "../../scripts/lib/scenario-checks.mjs";
import { fixtureFile, verifyFixtureSource } from "../fixtures/canonical-source.mjs";
import inventory from "../fixtures/upstream-source-index.mjs";
verifyFixtureSource();
const testAssets=new Map(inventory.files.map(row=>[row.path,fixtureFile(row.path)]));
try { runScenario("openapiYaml", {testAssets}); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
