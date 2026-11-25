// B1-03 focused exact-source Warm Industrial visual promotion contract.
// Verify art, WebView parity and explicitly untouched combat/pacing sources.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base='web/assets/m12/hangar-warm-empty-v1.svg';
const android='android/app/src/main/assets/assets/m12/hangar-warm-empty-v1.svg';
const bytes=fs.readFileSync(base);
const wrapped=Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes]);
const gitBlob=crypto.createHash('sha1').update(wrapped).digest('hex');
assert.equal(gitBlob,'7efe4b676141798c2a5ae77a827c79b64012bc47','pinned M13-C original Git blob');
assert.ok(bytes.equals(fs.readFileSync(android)),'Android must have exact same artwork bytes');
const html=fs.readFileSync('web/index.html','utf8');
const css=fs.readFileSync('web/style.css','utf8');
const js=fs.readFileSync('web/game.js','utf8');
assert.ok(html.includes('class="beta1-warm-hangar-plate" aria-hidden="true"'));
assert.ok(css.includes('data-hangar-study="warm"] .beta1-warm-hangar-plate'));
assert.ok(css.includes('url("assets/m12/hangar-warm-empty-v1.svg")'));
assert.ok(css.includes('z-index:1;pointer-events:none'));
assert.ok(js.includes("dock.dataset.hangarStudy=study==='blueprint'?'blueprint':'warm'"));
for(const file of ['index.html','style.css','game.js','scored-match.js','dossier.js','save-backup.js']){
 assert.ok(fs.readFileSync('web/'+file).equals(fs.readFileSync('android/app/src/main/assets/'+file)),file+' mirror mismatch');
}
const changed=execFileSync('git',['diff','--name-only','origin/main...HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allowed=/^(web\/(assets\/m12\/hangar-warm-empty-v1\.svg|index\.html|style\.css)|android\/app\/src\/main\/assets\/(assets\/m12\/hangar-warm-empty-v1\.svg|index\.html|style\.css)|tests\/beta1-warm-hangar-contract\.mjs|tests\/reward-hangar-navigation-qa\.mjs|\.github\/workflows\/beta1-warm-hangar-qa\.yml|docs\/BETA1_WARM_HANGAR_2026-11-25\.md)$/;
assert.ok(changed.every(path=>allowed.test(path)),'Unsafe game/source mutation: '+changed.filter(p=>!allowed.test(p)).join(', '));
assert.ok(!changed.includes('web/game.js')&&!changed.includes('android/app/src/main/assets/game.js'));
console.log('BETA1_WARM_HANGAR_SOURCE_CONTRACT_PASS asset_git_blob='+gitBlob+' changed_files='+changed.length);
