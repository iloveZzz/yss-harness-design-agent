import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {fixtureFile,verifyFixtureSource} from '../../../../tests/fixtures/canonical-source.mjs';
import inventory from '../../../../tests/fixtures/upstream-source-index.mjs';
import {scenarioSourceIdentities} from '../../../../scripts/lib/template-verification.mjs';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
test('fixed test closure is portable, source bound and fail closed',async()=>{
 assert.match(inventory.source_head,/^[a-f0-9]{40}$/);verifyFixtureSource();
 assert.throws(()=>fixtureFile('../escape'),/unknown-reference/);
 assert.throws(()=>fixtureFile('/tmp/foreign'),/unknown-reference/);
 assert.throws(()=>fixtureFile('unknown/asset'),/unknown-reference/);
 assert.ok(scenarioSourceIdentities('tests/fixtures/upstream-source-index.mjs').some(ref=>ref.startsWith('scripts/verify-')));
 const sandbox=fs.mkdtempSync(path.join(os.tmpdir(),'fixture space '));
 try {
  fs.cpSync(path.join(repo,'tests/fixtures'),path.join(sandbox,'tests/fixtures'),{recursive:true});
  const resolver=await import(pathToFileURL(path.join(sandbox,'tests/fixtures/canonical-source.mjs')).href);
  resolver.verifyFixtureSource();
  const ref=inventory.files[0].path,target=resolver.fixtureFile(ref),raw=fs.readFileSync(target),mode=fs.statSync(target).mode&0o777;
  fs.writeFileSync(target,'drift');assert.throws(()=>resolver.fixtureFile(ref),/source-drift/);fs.writeFileSync(target,raw);
  fs.chmodSync(target,mode^0o100);assert.throws(()=>resolver.fixtureFile(ref),/source-drift/);fs.chmodSync(target,mode);
  fs.unlinkSync(target);assert.throws(()=>resolver.fixtureFile(ref));
  const outside=path.join(sandbox,'foreign');fs.writeFileSync(outside,raw);fs.symlinkSync(outside,target);assert.throws(()=>resolver.fixtureFile(ref),/symlink/);fs.unlinkSync(target);fs.writeFileSync(target,raw);fs.chmodSync(target,mode);
  const source=path.join(sandbox,'tests/fixtures/upstream-source'),moved=source+'-saved';fs.renameSync(source,moved);fs.symlinkSync(moved,source);assert.throws(()=>resolver.fixtureFile(ref),/symlink-root/);
 }finally{fs.rmSync(sandbox,{recursive:true,force:true});}
});
