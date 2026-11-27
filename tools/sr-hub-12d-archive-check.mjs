// Owner-local archive byte verification; no download, upload, signing, or installation.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const [inventoryPath,directory]=process.argv.slice(2);
assert.ok(inventoryPath&&directory,'usage: node tools/sr-hub-12d-archive-check.mjs inventory.json archive-directory');
const inventory=JSON.parse(fs.readFileSync(inventoryPath,'utf8'));
assert.equal(inventory.schemaVersion,1);
assert.equal(inventory.repository,'EdenP-Development/Ricochet-Rumble');
assert.ok(Array.isArray(inventory.records)&&inventory.records.length>0);
const ids=new Set(), results=[];
for(const r of inventory.records){
 assert.ok(Number.isSafeInteger(r.id)&&r.id>0&&!ids.has(r.id),'invalid/duplicate artifact id');
 ids.add(r.id);
 assert.match(r.zipSha256,/^[0-9a-f]{64}$/);
 assert.ok(Number.isSafeInteger(r.size)&&r.size>0);
 const file=path.join(directory,String(r.id)+'.zip');
 if(!fs.existsSync(file)){results.push({id:r.id,status:'missing'});continue}
 const st=fs.lstatSync(file);
 if(!st.isFile()||st.isSymbolicLink()){results.push({id:r.id,status:'invalid_file'});continue}
 if(st.size!==r.size){results.push({id:r.id,status:'size_mismatch'});continue}
 const actual=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
 results.push({id:r.id,status:actual===r.zipSha256?'verified':'hash_mismatch'});
}
console.log(JSON.stringify({scope:'local ZIP byte check only; not independent custody or APK signing verification',results},null,2));
if(results.some(r=>r.status!=='verified'))process.exitCode=1;
