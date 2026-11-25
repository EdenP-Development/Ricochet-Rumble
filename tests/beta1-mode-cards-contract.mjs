// B1-03-B: verify byte-for-byte M13 art, no gameplay mutation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const original={
 cqc:'2a2e1913b8c5eae2548866b9bb300b7a4b90a7aa',
 ffa:'01b600fe48a1d5c4ff7b994aa323cda42bad9f8b',
 tdm:'e9f4ee39002bac2072a5f4bb8d107ee6ffbef6cf',
 custom:'d085dee30f92ead686aac2c9c22e3188a4092423'
};
const css=fs.readFileSync('web/style.css','utf8');
const html=fs.readFileSync('web/index.html','utf8');
for(const [mode,expected] of Object.entries(original)){
 const name='mode-'+mode+'-study-v1.svg';
 const bytes=fs.readFileSync('web/assets/m12/'+name);
 const gitBlob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
 assert.equal(gitBlob,expected,name+' exact original Git blob');
 assert.ok(bytes.equals(fs.readFileSync('android/app/src/main/assets/assets/m12/'+name)),name+' Android art parity');
 assert.ok(css.includes('url("assets/m12/'+name+'")'),name+' referenced in CSS');
 assert.ok(html.includes('mode-mission mode-'+mode),name+' authentic button');
}
for(const path of ['game.js','index.html','style.css','scored-match.js','dossier.js','save-backup.js']){
 assert.ok(fs.readFileSync('web/'+path).equals(fs.readFileSync('android/app/src/main/assets/'+path)),path+' Android mirror');
}
assert.ok(css.includes('B1-03-B: exact accepted M13 illustrated core Mode Select cards'));
assert.ok(css.includes('pointer-events:none'));
const buttons={
 cqc:['cqc','PILOTS ONLY · 10 KOs'],
 ffa:['scored_ffa','VEHICLE COMBAT · 10 KOs'],
 tdm:['scored_tdm','2 TEAMS · 15 KOs'],
 custom:['custom','YOUR RULES · YOUR ARENA']
};
for(const [mode,[action,label]] of Object.entries(buttons)){
 assert.ok(html.includes('class="mode-mission mode-'+mode+'" data-action="'+action+'"'),'unchanged real action '+mode);
 assert.ok(html.includes(label),'unchanged mode label '+mode);
}
const changed=execFileSync('git',['diff','--name-only','origin/feature/beta1-warm-industrial-hangar-slice-2026-11-25...HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allow=/^(web\/(style\.css|assets\/m12\/mode-(?:cqc|ffa|tdm|custom)-study-v1\.svg)|android\/app\/src\/main\/assets\/(style\.css|assets\/m12\/mode-(?:cqc|ffa|tdm|custom)-study-v1\.svg)|tests\/beta1-mode-cards-(?:contract|browser-qa)\.mjs|\.github\/workflows\/beta1-mode-cards-qa\.yml|docs\/BETA1_MODE_CARDS_2026-11-25\.md)$/;
assert.ok(changed.every(x=>allow.test(x)),'Unsafe source change: '+changed.filter(x=>!allow.test(x)).join(','));
assert.ok(!changed.includes('web/game.js')&&!changed.includes('android/app/src/main/assets/game.js'));
console.log('BETA1_MODE_CARDS_SOURCE_PASS '+JSON.stringify({changed:changed.length,original,gameplayChanged:false}));
