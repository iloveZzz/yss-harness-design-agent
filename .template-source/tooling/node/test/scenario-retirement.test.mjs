import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {pathToFileURL,fileURLToPath} from 'node:url';import test from 'node:test';
const root=fileURLToPath(new URL('../../../../',import.meta.url)),mod=await import(pathToFileURL(path.join(root,'scripts/lib/template-verification.mjs')));test('场景退役执行绑定、范围、旧报告、运行时与路由反例',()=>{const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'yss mapped space '));
try {
 assert.equal(spawnSync('git',['init','-q'],{cwd:fixture}).status,0);
 const put=(ref,text='console.log("mapped");\n')=>{const f=path.join(fixture,ref);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,text);return f;};
 put('scripts/lib/template-verification.mjs',fs.readFileSync(path.join(root,'scripts/lib/template-verification.mjs')));
 const old='scripts/verify-digital-human-task-package-scenarios',target=mod.resolveScenarioSource(old);
 assert.throws(()=>mod.compileScenarioExecution(old,{root:fixture}),/TARGET_MISSING/);
 const file=put(target);const actual=mod.compileScenarioExecution(old,{root:fixture});assert.equal(spawnSync(actual.file,actual.args,{cwd:actual.cwd}).status,0);mod.assertScenarioExecution(actual,{root:fixture});
 assert.equal(mod.resolveScenarioSource('scripts/verify-subagent-task-package-scenarios'),target);
 assert.throws(()=>mod.resolveScenarioSource('scripts/verify-unregistered-scenarios'),/MAPPING_MISSING/);
 assert.throws(()=>mod.assertScenarioExecution({command:old},{root:fixture}),/LEGACY_REPORT/);
 assert.throws(()=>mod.assertScenarioExecution({...actual,args:['wrong']},{root:fixture}),/EXECUTION_DRIFT/);
 fs.appendFileSync(file,'// changed\n');assert.throws(()=>mod.assertScenarioExecution(actual,{root:fixture}),/EXECUTION_DRIFT/);
 fs.unlinkSync(file);fs.symlinkSync(import.meta.filename,file);assert.throws(()=>mod.compileScenarioExecution(old,{root:fixture}),/SYMLINK|ESCAPE/);
 fs.unlinkSync(file);put(target);assert.equal(mod.compileScenarioExecution('node -e "console.log(\'scripts/verify-subagent-task-package-scenarios\')"',{root:fixture}),null);
 assert.throws(()=>mod.compileScenarioExecution(old+'; echo bypass',{root:fixture}),/COMMAND_EXPANSION/);
 const plan=mod.planTemplateVerification({profile:'release',changedFiles:[]});
 const historicalSources=mod.scenarioSourceIdentities('tests/fixtures/mapping-coverage').filter(ref=>ref.startsWith('scripts/'));
 assert.equal(historicalSources.length,28);
 for(const source of historicalSources){
  const current=mod.resolveScenarioSource(source);
  for(const profile of ['fast','candidate','release']){
   const a=mod.planTemplateVerification({profile,changedFiles:[source]}),b=mod.planTemplateVerification({profile,changedFiles:[current]});assert.equal(a.effective_profile,b.effective_profile);assert.deepEqual(a.groups,b.groups);assert.deepEqual(a.commands,b.commands);
  }
 }
 const python='scripts/verify-scaffold-generator-scenarios';
 try {
  const py=mod.resolveScenarioSource(python);put(py,'print("real Python")\n');const run=mod.compileScenarioExecution(python,{root:fixture});assert.equal(spawnSync(run.file,run.args,{cwd:run.cwd}).status,0);const syntax=mod.compileScenarioExecution('node --check '+python,{root:fixture});assert.equal(spawnSync(syntax.file,syntax.args,{cwd:syntax.cwd}).status,0);assert.ok(!fs.existsSync(path.join(fixture,'tests/scenarios/__pycache__')));
  const previous=process.env.PATH;process.env.PATH='/does-not-exist';try{assert.throws(()=>mod.compileScenarioExecution(python,{root:fixture}),/PYTHON_UNAVAILABLE/);}finally{process.env.PATH=previous;}
 } catch(error){if(!/MAPPING_MISSING/.test(error.message))throw error;}
 console.log('Fixed execution, scope, input drift, old reports, runtime, routing and eval guards passed');
} finally {fs.rmSync(fixture,{recursive:true,force:true});}

});
