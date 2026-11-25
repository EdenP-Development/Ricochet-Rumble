// B1-03-C original M13 insignia source and no-gameplay-change contract.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const exact={
 field:'5443b63d2c3acd4a81f165d607a96845df8d47e8',
 vector:'6de10eccc3d34bcbb5aa6dc470868ea625f1637e',
 ace:'708f7a07753d6025b2027b6d1a76bf87cb119514',
 command:'a68965cd619f25514978b305e0d36feaa0cb3267'
};
const css=fs.readFileSync('web/style.css','utf8');
const html=fs.readFileSync('web/index.html','utf8');
const game=fs.readFileSync('web/game.js','utf8');
for(const [id,blob] of Object.entries(exact)){
 const name='insignia-'+id+'-study-v1.svg';
 const bytes=fs.readFileSync('web/assets/m12/'+name);
 const realBlob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
 assert.equal(realBlob,blob,'original M13-C artwork '+id);
 assert.ok(bytes.equals(fs.readFileSync('android/app/src/main/assets/assets/m12/'+name)),id+' bundled Android mirror');
 assert.ok(css.includes('url("assets/m12/'+name+'")'),id+' linked locally');
 assert.ok(css.includes(':has(use[href="#sr-mark-'+id+'"])'),id+' selector derives existing real state');
 assert.ok(html.includes('data-emblem-id="mark.'+id+'"'),id+' actual Hangar button');
}
assert.ok(html.includes('id="dossier-emblem-mark"'));
assert.ok(html.includes('id="insignia-detail-use"'));
assert.ok(game.includes("markUse.setAttribute('href','#sr-mark-'+equippedEmblem.slice(5))"),'Dossier already derives equipped identity');
assert.ok(game.includes("detailIcon.setAttribute('href','#sr-mark-'+equippedEmblem.slice(5))"),'Hangar already derives equipped identity');
assert.ok(css.includes('B1-03-C: exact owner-reviewed M13 insignia artwork'));
for(const file of ['game.js','index.html','style.css','dossier.js','scored-match.js','save-backup.js']){
 assert.ok(fs.readFileSync('web/'+file).equals(fs.readFileSync('android/app/src/main/assets/'+file)),file+' Android mirror');
}
const changed=execFileSync('git',['diff','--name-only','origin/feature/beta1-mode-cards-slice-2026-11-25...HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allowed=/^(web\/(style\.css|assets\/m12\/insignia-(field|vector|ace|command)-study-v1\.svg)|android\/app\/src\/main\/assets\/(style\.css|assets\/m12\/insignia-(field|vector|ace|command)-study-v1\.svg)|tests\/beta1-insignia-(contract|browser-qa)\.mjs|\.github\/workflows\/beta1-insignia-qa\.yml|docs\/BETA1_INSIGNIA_2026-11-25\.md)$/;
assert.ok(changed.every(p=>allowed.test(p)),'Unsafe change against parent PR #156: '+changed.filter(p=>!allowed.test(p)).join(','));
assert.ok(!changed.includes('web/game.js')&&!changed.includes('android/app/src/main/assets/game.js'));
console.log('BETA1_INSIGNIA_SOURCE_PASS '+JSON.stringify({exact,changed:changed.length,gameplayChanged:false}));
