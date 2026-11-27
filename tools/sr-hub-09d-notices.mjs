import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const expected={'@pixi/colord':['2.9.6','MIT'],earcut:['3.2.4','ISC'],eventemitter3:['5.0.4','MIT'],ismobilejs:['1.1.1','MIT'],'parse-svg-path':['0.1.2','MIT'],'pixi.js':['8.18.0','MIT']};
const out='qa-results/sr-hub-09d';
fs.mkdirSync(out,{recursive:true});
const metadata=JSON.parse(fs.readFileSync(out+'/metafile.json'));
const membership=new Set();
for(const o of Object.values(metadata.outputs))for(const [p,v] of Object.entries(o.inputs)){
 const match=p.match(/^node_modules\/(@[^/]+\/[^/]+|[^/]+)/);
 if(match&&v.bytesInOutput)membership.add(match[1]);
}
assert.deepEqual([...membership].sort(),Object.keys(expected).sort());
const records=[];let notices='Sector Rebound — THIRD-PARTY NOTICE REVIEW DRAFT\nNot cleared for distribution. Missing notices are explicit.\n';
for(const [name,[version,license]] of Object.entries(expected)){
 const dir=path.join('hybrid-ui/node_modules',name),pkg=JSON.parse(fs.readFileSync(dir+'/package.json','utf8'));
 assert.equal(pkg.version,version);assert.equal(pkg.license,license);
 const files=fs.readdirSync(dir).filter(n=>/^(licen[cs]e|copying|notice|copyright)([._-].*|$)/i.test(n)&&fs.statSync(path.join(dir,n)).isFile()).sort();
 const row={name,version,license,repository:pkg.repository??null,files:[],status:files.length?'notice_captured_review_pending':'missing_notice_release_blocker'};
 notices+='\n==== '+name+' '+version+' ('+license+') ====\n';
 if(!files.length)notices+='MISSING: obtain applicable original upstream copyright and license text.\n';
 for(const n of files){
  const b=fs.readFileSync(path.join(dir,n));assert.ok(b.length>0);
  row.files.push({name:n,sha256:crypto.createHash('sha256').update(b).digest('hex')});
  notices+='\n--- '+n+' ---\n'+b.toString('utf8')+'\n';
 }
 records.push(row);
}
fs.writeFileSync(out+'/THIRD_PARTY_NOTICES_DRAFT.txt',notices);
fs.writeFileSync(out+'/notices-register.json',JSON.stringify({scope:'actual measured JS bundle membership; notice completeness and legal review pending',records},null,2)+'\n');
console.log('SR_HUB_09D_NOTICE_REGISTER '+JSON.stringify(records));
