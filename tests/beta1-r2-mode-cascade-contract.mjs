// B1-R2 safety: CSS visual-only Mode Select patch, source + Android parity.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const parent='origin/audit/beta1-refinement-baseline-2026-11-25';
const changed=execFileSync('git',['diff','--name-only',parent+'...HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allowed=new Set(['web/style.css','android/app/src/main/assets/style.css',
 'tests/beta1-r2-mode-cascade-browser-qa.mjs','tests/beta1-r2-mode-cascade-contract.mjs',
 '.github/workflows/beta1-r2-mode-cascade-qa.yml','docs/BETA1_R2_MODE_CASCADE_2026-11-25.md']);
assert.ok(changed.every(x=>allowed.has(x)),'Unexpected source change '+changed.filter(x=>!allowed.has(x)));
for(const name of ['game.js','index.html','style.css','scored-match.js','dossier.js','save-backup.js']){
 assert.ok(fs.readFileSync('web/'+name).equals(fs.readFileSync('android/app/src/main/assets/'+name)),name+' exact Android parity');
 if(name!=='style.css'){
  const original=execFileSync('git',['show',parent+':web/'+name]);
  assert.ok(original.equals(fs.readFileSync('web/'+name)),'Protected runtime unchanged '+name);
 }
}
const original=execFileSync('git',['show',parent+':web/style.css'],{encoding:'utf8'});
const current=fs.readFileSync('web/style.css','utf8');
assert.notEqual(current,original);
const block=s=>s.slice(s.indexOf('/* B1-03-B:')>=0?s.indexOf('/* B1-03-B:'):s.indexOf('/* B1-R2:'),s.indexOf('/* B1-03-C:'));
const head=original.indexOf('/* B1-03-B:');
const tail=original.indexOf('/* B1-03-C:',head);
const oldBlock=original.slice(head,tail);
const newHead=current.indexOf('/* B1-R2:');
const newTail=current.indexOf('/* B1-03-C:',newHead);
const newBlock=current.slice(newHead,newTail);
assert.ok(newHead>=0&&newTail>newHead,'R2 targeted original card block');
assert.equal(current.slice(0,newHead),original.slice(0,head),'All pre-card styles byte-identical');
assert.equal(current.slice(newTail),original.slice(tail),'All post-card styles byte-identical');
assert.ok(newBlock.includes('#menu #panel .mode-screen .mode-grid .mode-mission{'));
assert.ok(newBlock.includes('#menu #panel .mode-screen .mode-grid .mode-mission .mode-copy strong{color:#f4f6f1}'));
assert.ok(newBlock.includes('#menu #panel .mode-screen .mode-grid .mode-mission .mode-copy small{color:#bdd4d6}'));
assert.ok(!newBlock.includes('!important'),'No CSS escalation via !important');
for(const id of ['cqc','ffa','tdm','custom'])assert.ok(newBlock.includes('mode-'+id+'-study-v1.svg'));
console.log('BETA1_R2_MODE_CASCADE_CONTRACT_PASS '+JSON.stringify({changed,appIdUntouched:true,gameplayUntouched:true,oldBlockLength:oldBlock.length,newBlockLength:newBlock.length}));
