// Test-only canonical dependency resolver. No discovery/fallback into other repositories.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import inventory from './upstream-source-index.mjs';
export const sourceRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'upstream-source');
const rows=new Map(inventory.files.map(row=>[row.path,row]));
if(rows.size!==inventory.files.length||inventory.source_state!=="working-tree")throw new Error("test-fixture-invalid-inventory");
export function fixtureFile(ref) {
  const row=rows.get(ref);
  if(!row||path.isAbsolute(ref)||ref.split(/[\\/]/).includes('..'))throw new Error('test-fixture-unknown-reference: '+ref);
  if(fs.lstatSync(sourceRoot).isSymbolicLink())throw new Error("test-fixture-symlink-root");
  let target=sourceRoot;
  for(const part of (row.storage_path||ref).split('/')) { target=path.join(target,part);if(fs.lstatSync(target).isSymbolicLink())throw new Error('test-fixture-symlink: '+ref); }
  const info=fs.statSync(target);
  if(!info.isFile()||createHash('sha256').update(fs.readFileSync(target)).digest('hex')!==row.sha256||(info.mode&0o777)!==row.mode)throw new Error('test-fixture-source-drift: '+ref);
  return target;
}
export function verifyFixtureSource() {
  const actual=[];
  const visit=(dir,ref='')=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const name=ref?ref+'/'+entry.name:entry.name;if(entry.isSymbolicLink())throw new Error('test-fixture-symlink: '+name);if(entry.isDirectory())visit(path.join(dir,entry.name),name);else if(entry.isFile())actual.push(name);else throw new Error('test-fixture-invalid-file: '+name);}};
  if(fs.lstatSync(sourceRoot).isSymbolicLink())throw new Error('test-fixture-symlink-root');
  visit(sourceRoot);
  if(JSON.stringify(actual.sort())!==JSON.stringify(inventory.files.map(row=>row.storage_path||row.path).sort()))throw new Error('test-fixture-inventory-drift');
  for(const row of inventory.files)fixtureFile(row.path);return inventory;
}
