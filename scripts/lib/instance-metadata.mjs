import path from 'node:path';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync } from './validation-phase.mjs';
import { parseAsset } from './structured-assets.mjs';

const profiles={spec:{id:'harness.spec-template',legacy:'.yss-template.json'},design:{id:'harness.business-ddd-strategy-handoff',legacy:'.yss-harness-design.json'},backend:{id:'harness.backend-delivery',legacy:'.yss-harness-backend.json'},frontend:{id:'harness.frontend-delivery',legacy:'.yss-harness-frontend.json'}};
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const hex=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const ensure=(ok,message)=>{if(!ok)throw new TypeError('INSTANCE_IDENTITY: '+message);};
function read(root,ref){let cursor=root;for(const part of ref.split('/')){cursor=path.join(cursor,part);const stat=lstatSync(cursor,{throwIfNoEntry:false});if(!stat)return null;ensure(!stat.isSymbolicLink()&&(cursor===path.join(root,ref)?stat.isFile():stat.isDirectory()),'身份路径必须为普通文件: '+ref);}return parseAsset(readFileSync(cursor),ref);}
function descriptor(value){ensure(value?.type==='file'&&hex(value.digest)&&[420,493].includes(value.mode),'未知受管文件描述');return {type:value.type,digest:value.digest,mode:value.mode};}
function managedDigest(managed){ensure(managed&&typeof managed==='object'&&!Array.isArray(managed),'受管基线缺失');const ordered=[];for(const ref of Object.keys(managed).sort()){ensure(ref&&!ref.startsWith('/')&&!ref.includes('\\')&&!ref.split('/').some(p=>!p||p==='.'||p==='..'||p.toLowerCase()==='.git'),'受管路径越界');const item=managed[ref];ordered.push(JSON.stringify(ref)+':'+JSON.stringify({baseline:descriptor(item.baseline),lastApplied:descriptor(item.lastApplied),ownership:item.ownership}));ensure(typeof item.ownership==='string','归属缺失');}return sha(('{'+ordered.join(',')+'}').replace(/[<>&\u2028\u2029]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0')));}
/** Native identity wins only after validation; preserved legacy bytes are lineage. */
export function readInstanceMetadata(root){
 root=path.resolve(root);const native=read(root,'.yss.json'),legacy=[];for(const [profile,p] of Object.entries(profiles)){const value=read(root,p.legacy);if(value)legacy.push({profile,metadataRef:p.legacy,metadata:value,kind:'legacy'});}
 ensure(legacy.length<=1,'检测到多个旧家族 metadata');
 if(!native)return legacy[0]??null;
 ensure([1,2].includes(native.schemaVersion)&&native.protocolVersion===1,'未知 native metadata 或协议');const p=profiles[native.profile];ensure(p&&native.profileId===p.id&&(!legacy.length||legacy[0].profile===native.profile),'native 与家族身份矛盾');
 ensure(native.templateSourceState==='committed'&&/^[a-f0-9]{40}$/.test(native.templateCommit)&&hex(native.snapshotHash)&&hex(native.manifestHash),'native 来源缺失或不合法');
 if(native.schemaVersion===2)ensure(native.bundleSchemaVersion===2&&hex(native.bundleHash)&&['committed','working-tree','unknown'].includes(native.cliSourceState)&&(!native.cliCommit||/^[a-f0-9]{40}$/.test(native.cliCommit))&&(native.cliSourceState!=='committed'||native.cliCommit),'native v2来源不合法');
 ensure(native.variables&&native.distribution&&hex(native.baselineDigest)&&managedDigest(native.managedFiles)===native.baselineDigest,'native 受管基线摘要不一致');
 return {kind:'native',profile:native.profile,metadataRef:'.yss.json',metadata:native};
}
export function appliedManagedDigest(item){return item?.lastApplied?.digest??item?.contentHash;}
