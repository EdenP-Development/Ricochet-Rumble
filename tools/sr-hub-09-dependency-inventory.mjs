import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='hybrid-ui',out='qa-results/sr-hub-09';
const lock=JSON.parse(fs.readFileSync(root+'/package-lock.json','utf8'));
assert.equal(lock.lockfileVersion,3);
const records=[];
for(const [p,entry] of Object.entries(lock.packages)){
 if(!p)continue;
 assert.ok(p.startsWith('node_modules/')&&!p.split('/').includes('..'),'unsafe package path');
 assert.ok(entry.integrity&&/^sha(256|384|512)-/.test(entry.integrity),'missing registry integrity '+p);
 assert.ok(entry.resolved?.startsWith('https://registry.npmjs.org/'),'unexpected package registry '+p);
 const dir=path.join(root,p), manifest=path.join(dir,'package.json');
 if(!fs.existsSync(manifest)){assert.ok(entry.optional,'missing nonoptional dependency '+p);records.push({path:p,version:entry.version,installed:false,license:entry.license??null,scope:'optional platform package'});continue;}
 const pkg=JSON.parse(fs.readFileSync(manifest,'utf8'));
 assert.equal(pkg.version,entry.version);
 const notices=fs.readdirSync(dir).filter(n=>/^(licen[cs]e|copying|notice|copyright)([._-].*|$)/i.test(n)&&fs.statSync(path.join(dir,n)).isFile()).map(n=>({name:n,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,n))).digest('hex'),text:fs.readFileSync(path.join(dir,n),'utf8')}));
 records.push({path:p,name:pkg.name,version:pkg.version,installed:true,license:pkg.license??null,dev:!!entry.dev,notices});
}
fs.writeFileSync(out+'/license-inventory.json',JSON.stringify({scope:'installed npm package metadata and notice files; not legal clearance or actual bundle membership',records},null,2)+'\n');
console.log('SR_HUB_09_INVENTORY',JSON.stringify({locked:records.length,installed:records.filter(r=>r.installed).length,missingLicense:records.filter(r=>r.installed&&!r.license).map(r=>r.path),missingNotice:records.filter(r=>r.installed&&!r.notices.length).map(r=>r.path)}));
