import {contextExecution, contextBinary} from './native-context.mjs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, statSync, lstatSync, readlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "../vendor/yaml.mjs";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const PROFILE_FILE = path.join(ROOT, ".template-source/process/template-verification-profiles.yaml");

function fail(message) { throw new TypeError(message); }
function ensure(condition, message) { if (!condition) fail(message); }

function globRegex(pattern) {
  let source = "";
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === "*" && pattern[index + 1] === "*") {
      source += ".*";
      index += 1;
    } else if (char === "*") source += "[^/]*";
    else if (char === "?") source += "[^/]";
    else source += char.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
  }
  return new RegExp(`^${source}$`);
}

function matches(file, pattern) { return globRegex(pattern).test(file); }

export function loadVerificationProfiles(source = readFileSync(PROFILE_FILE, "utf8")) {
  const document = parseDocument(source, { uniqueKeys: true });
  ensure(document.errors.length === 0, document.errors[0]?.message || "核验 profile 无法解析");
  const config = document.toJS({ maxAliasCount: 0 });
  ensure(config?.schema_version === 1, "核验 profile schema_version 必须为 1");
  ensure(config.profiles?.fast && config.profiles?.candidate && config.profiles?.release, "必须声明 fast、candidate、release profile");
  ensure(config.groups && typeof config.groups === "object", "核验 profile 缺少 groups");
  for (const [name, group] of Object.entries(config.groups)) ensure(Array.isArray(group.commands), `检查组 ${name} 缺少 commands`);
  return config;
}

function matchedGroups(config, changedFiles) {
  const groups = new Set();
  const unknown = [];
  for (const file of changedFiles) {
    let routed = false;
    for (const rule of config.routing || []) {
      if ((rule.patterns || []).some((pattern) => scenarioSourceIdentities(file).some(ref=>matches(ref, pattern)))) {
        routed = true;
        for (const group of rule.groups || []) groups.add(group);
      }
    }
    if (!routed) unknown.push(file);
  }
  return { groups, unknown };
}

export function planTemplateVerification({ profile = "fast", changedFiles = [], config = loadVerificationProfiles() } = {}) {
  ensure(Object.hasOwn(config.profiles, profile), `未知核验 profile: ${profile}`);
  ensure(Array.isArray(changedFiles), "changedFiles 必须是数组");
  const normalized = [...new Set(changedFiles.map((file) => file.replaceAll("\\", "/")).filter(Boolean))].sort();
  const routed = matchedGroups(config, normalized);
  const coreChange = normalized.find((file) => (config.core_escalation_patterns || []).some((pattern) => scenarioSourceIdentities(file).some(ref=>matches(ref, pattern))));
  let effectiveProfile = profile;
  let escalationReason = null;
  if (profile !== "release" && coreChange) {
    effectiveProfile = "release";
    escalationReason = `核心核验资产变化: ${coreChange}`;
  } else if (profile !== "release" && routed.unknown.length > 0) {
    effectiveProfile = "release";
    escalationReason = `存在未映射路径: ${routed.unknown.join(", ")}`;
  }
  const groups = new Set();
  if (config.profiles[effectiveProfile].all_groups) Object.keys(config.groups).forEach((group) => groups.add(group));
  else {
    (config.profiles[effectiveProfile].always_groups || []).forEach((group) => groups.add(group));
    routed.groups.forEach((group) => groups.add(group));
  }
  const orderedGroups = Object.keys(config.groups).filter((group) => groups.has(group));
  const commands = [];
  for (const group of orderedGroups) {
    for (const entry of config.groups[group].commands) {
      let command = typeof entry === "string" ? entry : entry.run;
      const when = typeof entry === "string" ? null : entry.when ?? null;
      ensure(typeof command === "string" && command, `检查组 ${group} 包含无效命令`);
      // Escalating fast changes verification breadth, not source authorization.
      if (profile === "fast" && command === "scripts/verify-strategic-handoff-tools-lock --require-committed") command = "scripts/verify-strategic-handoff-tools-lock";
      commands.push({ group, command, when });
    }
  }
  return { source_requirement: profile === "fast" ? "current" : "committed", requested_profile: profile, effective_profile: effectiveProfile, escalation_reason: escalationReason, changed_files: normalized, unknown_files: routed.unknown, groups: orderedGroups, commands, required_files: config.required_files || [], syntax_files: config.syntax_files || [], max_concurrency: config.max_concurrency || 4 };
}

export function assertRequiredFiles(plan, root = ROOT) {
  for(const ref of plan.required_files)if(SCENARIO_SOURCES.has(ref))scenarioFile(root,ref);
  const missing = plan.required_files.filter((file) => !existsSync(path.join(root, resolveScenarioSource(file))));
  ensure(missing.length === 0, `缺少模板必需文件: ${missing.join(", ")}`);
}

const SCENARIO_SOURCES=new Map([["scripts/verify-business-language-scenarios", "tests/scenarios/verify-business-language-scenarios.mjs"], ["scripts/verify-context-contract-scenarios", "tests/scenarios/verify-context-contract-scenarios.mjs"], ["scripts/verify-context-reconciliation-scenarios", "tests/scenarios/verify-context-reconciliation-scenarios.mjs"], ["scripts/verify-digital-human-roles-scenarios", "tests/scenarios/verify-digital-human-roles-scenarios.mjs"], ["scripts/verify-digital-human-task-package-scenarios", "tests/scenarios/verify-digital-human-task-package-scenarios.mjs"], ["scripts/verify-harness-profile-scenarios", "tests/scenarios/verify-harness-profile-scenarios.mjs"], ["scripts/verify-implementation-path-scenarios", "tests/scenarios/verify-implementation-path-scenarios.mjs"], ["scripts/verify-instance-distribution-scenarios", "tests/scenarios/verify-instance-distribution-scenarios.mjs"], ["scripts/verify-lifecycle-scenarios", "tests/scenarios/verify-lifecycle-scenarios.mjs"], ["scripts/verify-lifecycle-transition-scenarios", "tests/scenarios/verify-lifecycle-transition-scenarios.mjs"], ["scripts/verify-maintenance-intensity-scenarios", "tests/scenarios/verify-maintenance-intensity-scenarios.mjs"], ["scripts/verify-matt-yss-integration-scenarios", "tests/scenarios/verify-matt-yss-integration-scenarios.mjs"], ["scripts/verify-openapi-json-handoff-scenarios", "tests/scenarios/verify-openapi-json-handoff-scenarios.mjs"], ["scripts/verify-openapi-yaml-first-scenarios", "tests/scenarios/verify-openapi-yaml-first-scenarios.mjs"], ["scripts/verify-plan-requirements-context-scenarios", "tests/scenarios/verify-plan-requirements-context-scenarios.mjs"], ["scripts/verify-plan-spec-entry-scenarios", "tests/scenarios/verify-plan-spec-entry-scenarios.mjs"], ["scripts/verify-prototype-backend-scaffold-scenarios", "tests/scenarios/verify-prototype-backend-scaffold-scenarios.mjs"], ["scripts/verify-repository-scope-scenarios", "tests/scenarios/verify-repository-scope-scenarios.mjs"], ["scripts/verify-scaffold-generator-scenarios", "tests/scenarios/verify-scaffold-generator-scenarios.py"], ["scripts/verify-strategic-checkpoint-scenarios", "tests/scenarios/verify-strategic-checkpoint-scenarios.mjs"], ["scripts/verify-strategic-design-handoff-scenarios", "tests/scenarios/verify-strategic-design-handoff-scenarios.mjs"], ["scripts/verify-strategic-gate-migration-scenarios", "tests/scenarios/verify-strategic-gate-migration-scenarios.mjs"], ["scripts/verify-strategic-user-decision-scenarios", "tests/scenarios/verify-strategic-user-decision-scenarios.mjs"], ["scripts/verify-subagent-task-package-scenarios", "tests/scenarios/verify-digital-human-task-package-scenarios.mjs"], ["scripts/verify-template-verification-scenarios", "tests/scenarios/verify-template-verification-scenarios.mjs"], ["scripts/verify-yss-dto-openapi-scenarios", "tests/scenarios/verify-yss-dto-openapi-scenarios.mjs"], ["scripts/verify-yss-router-scenarios", "tests/scenarios/verify-yss-router-scenarios.mjs"], ["scripts/verify-yss-ui-scenarios", "tests/scenarios/verify-yss-ui-scenarios.mjs"]]);
const seenScenarioTargets=new Map();for(const [source,target]of SCENARIO_SOURCES){const prior=seenScenarioTargets.get(target);if(prior&&![prior,source].every(ref=>['scripts/verify-subagent-task-package-scenarios','scripts/verify-digital-human-task-package-scenarios'].includes(ref)))throw Error('SCENARIO_MAPPING_DUPLICATE');seenScenarioTargets.set(target,source);}

// Explicit source relocation; missing files never select a replacement.
export function resolveScenarioSource(ref) {
  if (SCENARIO_SOURCES.has(ref)) return SCENARIO_SOURCES.get(ref);
  if (/^scripts\/verify-[^/]+-scenarios$/.test(ref)) throw Error(`SCENARIO_MAPPING_MISSING: ${ref}`);
  return ref;
}
export function scenarioSourceIdentities(ref) {
  // Source-only fixture changes must select their scenario consumers.
  if(ref.startsWith('tests/fixtures/'))return [...new Set([ref,...SCENARIO_SOURCES.keys()])];
  return [ref, ...[...SCENARIO_SOURCES].filter(([,target])=>target===ref).map(([source])=>source)];
}
function scenarioFile(root,ref) {
  const target=resolveScenarioSource(ref),base=realpathSync(root),file=path.resolve(base,target);
  if (!existsSync(file)) throw Error(`SCENARIO_TARGET_MISSING: ${ref}`);
  const observed=realpathSync(file),relative=path.relative(base,observed);
  if (relative.startsWith('..')||path.isAbsolute(relative)||!statSync(file).isFile()) throw Error(`SCENARIO_TARGET_ESCAPE: ${ref}`);
  for (let current=file;current!==base;current=path.dirname(current)) if(lstatSync(current).isSymbolicLink())throw Error(`SCENARIO_TARGET_SYMLINK: ${ref}`);
  return file;
}
const scenarioHash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function scenarioInputDigest(root=ROOT) {
  const result=spawnSync('git',['ls-files','-z','-c','-o','--exclude-standard'],{cwd:root,encoding:'utf8'});
  if(result.status!==0)throw Error('SCENARIO_INPUT_INVENTORY_UNAVAILABLE');
  const refs=[...new Set(result.stdout.split('\0').filter(Boolean))].sort();
  return scenarioHash(JSON.stringify(refs.map(ref=>{
    const file=path.join(root,ref);
    if(!existsSync(file))return [ref,null];
    const st=lstatSync(file);if(st.isSymbolicLink())return [ref,'symlink',readlinkSync(file)];
    return st.isFile()?[ref,st.mode&0o777,scenarioHash(readFileSync(file))]:[ref,'directory'];
  })));
}
function scenarioWords(command) {
  const words=[];let word='',quote=null,started=false;
  for(let i=0;i<command.length;i++){
    const c=command[i];
    if(quote){if(c===quote){quote=null;continue;}if(c==='\\'&&quote==='"'){if(++i===command.length)throw Error('SCENARIO_COMMAND_INVALID');word+=command[i];continue;}if(quote==='"'&&/[$`]/.test(c))throw Error('SCENARIO_COMMAND_EXPANSION');word+=c;continue;}
    if(c==='"'||c==="'"){quote=c;started=true;continue;}
    if(c==='\\'){if(++i===command.length)throw Error('SCENARIO_COMMAND_INVALID');word+=command[i];started=true;continue;}
    if(/\s/.test(c)){if(started){words.push(word);word='';started=false;}continue;}
    if(/[;$`|&<>]/.test(c))throw Error('SCENARIO_COMMAND_EXPANSION');word+=c;started=true;
  }
  if(quote)throw Error('SCENARIO_COMMAND_INVALID');if(started)words.push(word);return words;
}
export function compileScenarioExecution(command,{root=ROOT,inputDigest}={}) {
  if(/^(?:node\s+)?scripts\/verify-context-contract(?:\s|$)/.test(command)||/^yss\s+context\s+check(?:\s|$)/.test(command)) {
    const words=scenarioWords(command);let execution;
    if(words[0]==='yss') { const binary=contextBinary();words.shift();execution={file:binary.binary,args:words,cwd:realpathSync(root),binary_sha256:binary.digest,protocol:"context-envelope-v1"}; }
    else {if(words[0]==='node')words.shift();words.shift();execution=contextExecution(root,words);}
    const target='scripts/lib/native-context.mjs';
    return {binding_version:1,requested_command:command,...execution,source_bindings:{mapping_sha256:scenarioHash(readFileSync(path.join(root,'scripts/lib/template-verification.mjs'))),target,target_sha256:scenarioHash(readFileSync(path.join(root,target)))},input_digest:inputDigest??scenarioInputDigest(root)};
  }
  // eval source is data, never a script operand.
  if(/^node\s/.test(command)&&/(?:^|\s)(?:-e|--eval|--input-type=module)(?:\s|=|$)/.test(command))return null;
  if(!/(?:scripts\/verify-[\w-]+-scenarios|tests\/scenarios\/verify-[\w-]+-scenarios\.(?:mjs|py))(?:\s|['";|&<>]|$)/.test(command))return null;
  const words=scenarioWords(command);let index=0;
  if(path.basename(words[0])==='node')index=words.findIndex(word=>SCENARIO_SOURCES.has(word)||/^scripts\/verify-[\w-]+-scenarios$/.test(word)||[...SCENARIO_SOURCES.values()].includes(word));
  if(index<0||!(index===0||path.basename(words[0])==='node'))throw Error('SCENARIO_COMMAND_UNSUPPORTED');
  const ref=words[index],target=scenarioFile(root,ref),prefix=words.slice(1,index),tail=words.slice(index+1);let file=process.execPath,args= index===0?[target,...tail]:[...prefix,target,...tail];
  if(target.endsWith('.py')){
    const observed=spawnSync('python3',['-c','import sys; print(sys.executable)'],{encoding:'utf8'});
    if(observed.status!==0||!path.isAbsolute(observed.stdout.trim())||!existsSync(observed.stdout.trim()))throw Error('SCENARIO_PYTHON_UNAVAILABLE');
    file=realpathSync(observed.stdout.trim());
    if(prefix.includes('--check'))args=['-c','import ast,sys; ast.parse(open(sys.argv[1],encoding="utf-8").read(),filename=sys.argv[1])',target];
    else {if(prefix.length)throw Error('SCENARIO_PYTHON_OPTIONS_UNSUPPORTED');args=[target,...tail];}
  }
  const mapping=path.join(root,'scripts/lib/template-verification.mjs');
  return {binding_version:1,requested_command:command,file,args,cwd:realpathSync(root),source_bindings:{mapping_sha256:scenarioHash(readFileSync(mapping)),target: path.relative(realpathSync(root),target).split(path.sep).join('/'),target_sha256:scenarioHash(readFileSync(target))},input_digest:inputDigest??scenarioInputDigest(root)};
}
export function assertScenarioExecution(binding,{root=ROOT}={}) {
  if(!binding||binding.binding_version!==1)throw Error('SCENARIO_LEGACY_REPORT_REJECTED');
  const current=compileScenarioExecution(binding.requested_command,{root});
  if(!current||JSON.stringify(current)!==JSON.stringify(binding))throw Error('SCENARIO_EXECUTION_DRIFT');
}
