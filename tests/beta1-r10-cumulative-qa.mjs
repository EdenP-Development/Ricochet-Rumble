// R10: retain exact-slice QA contracts, then replay their behavioral checks
// against the actual combined candidate without pretending it is an isolated slice.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const pinned='13137da7a2f63dd3169b5d8e4d826cf06f74d424';
const base='accb09d19e7efdae5a04e0739f6db61e1b5c2f49';
const git=(args)=>execFileSync('git',args,{encoding:'utf8'});
for(const root of ['web','android/app/src/main/assets']){
 const diff=git(['diff','--name-only',base,'HEAD','--',root]).trim().split('\n').filter(Boolean);
 assert.deepEqual(diff,[root+'/style.css'],'only cumulative CSS differs from R2 runtime');
 assert.equal(fs.readFileSync(root+'/style.css','utf8'),git(['show',pinned+':'+root+'/style.css']));
}
assert.equal(fs.readFileSync('web/style.css','utf8'),fs.readFileSync('android/app/src/main/assets/style.css','utf8'));
const suites=['r3-home-scroll','r4-home-material','r5-hangar-material','r6-dossier-material','r7-lan-material','r8-combat-hud'];
const report=[];
for(const name of suites){
 const file='tests/beta1-'+name+'-browser-qa.mjs';
 let code=fs.readFileSync(file,'utf8');
 // Only remove isolated CSS delta assertions from a temporary replay copy.
 // The original tests are unchanged; runtime parity and browser checks remain.
 const start=code.indexOf(name.startsWith('r3')?'const old=':name.startsWith('r8')?'const a=before.split':'assert.notEqual(after,before);');
 const end=code.indexOf(name.startsWith('r8')?'for(const n of':'assert.equal(after,fs.readFileSync',start);
 assert.ok(start>=0&&end>start,'known exact-slice guard '+name);
 code=code.slice(0,start)+code.slice(end);
 const temporary='tests/.r10-replay-'+name+'.mjs';
 try{fs.writeFileSync(temporary,code,{flag:'wx'});execFileSync(process.execPath,[temporary],{stdio:'inherit'});report.push({suite:name,result:'PASS',mode:'combined candidate behavioral replay'});}
 finally{fs.rmSync(temporary,{force:true});}
}
fs.mkdirSync('qa-results',{recursive:true});
fs.writeFileSync('qa-results/beta1-r10-cumulative.json',JSON.stringify({result:'PASS',pinned,report},null,2));
