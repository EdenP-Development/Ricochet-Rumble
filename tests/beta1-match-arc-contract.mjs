// B1-03-D approved M13 presentation, canonical source parity and safety contract.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const game=fs.readFileSync('web/game.js','utf8');
const html=fs.readFileSync('web/index.html','utf8');
const css=fs.readFileSync('web/style.css','utf8');
for(const path of ['game.js','index.html','style.css','scored-match.js','dossier.js','save-backup.js'])
 assert.ok(fs.readFileSync('web/'+path).equals(fs.readFileSync('android/app/src/main/assets/'+path)),path+' Android bundle parity');
for(const name of ['matchArcFor','refreshMatchArc','soloWatchActive','soloWatchCandidates','soloWatchTarget','updateSoloWatchUI','cycleSoloWatchTarget'])
 assert.ok(game.includes('function '+name+'('),name+' is implemented');
assert.ok(game.includes("const arc=mode==='solo'?refreshMatchArc(clock):false"),'stage gate is Solo only');
assert.ok(game.includes("watchTarget=mode==='solo'?soloWatchTarget():null"),'camera follows only Solo survivor');
assert.ok(game.includes("document.getElementById('solo-watch-next')?.addEventListener('click'"),'actual spectator selector');
assert.ok(html.includes('id="solo-watch-bar"')&&html.includes('id="solo-watch-next"'));
assert.ok(css.includes('.game-screen.solo-watching .battlefield>.touch-zone{display:none!important;pointer-events:none!important}'));
assert.ok(css.includes('.score-clock.match-arc'));
assert.ok(game.includes("'survival_ffa','survival_teams'"),'no CTF/daily spectator');
const changed=execFileSync('git',['diff','--name-only','origin/feature/beta1-dossier-insignia-slice-2026-11-25...HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allowed=new Set(['web/game.js','android/app/src/main/assets/game.js','web/index.html','android/app/src/main/assets/index.html','web/style.css','android/app/src/main/assets/style.css','tests/beta1-match-arc-contract.mjs','tests/beta1-match-arc-browser-qa.mjs','.github/workflows/beta1-match-arc-qa.yml','docs/BETA1_MATCH_ARC_2026-11-25.md']);
assert.ok(changed.every(p=>allowed.has(p)),'unexpected changed path: '+changed.filter(p=>!allowed.has(p)));
for(const path of ['web/scored-match.js','web/ctf-rules.js','web/ctf-ai.js','web/save-backup.js','web/dossier.js','android/app/build.gradle','android/app/build.gradle.kts'])
 assert.ok(!changed.includes(path),'protected engine or packaging changed: '+path);
console.log('BETA1_MATCH_ARC_CONTRACT_PASS '+JSON.stringify({paths:changed,gameplayRulesModified:false,saveSchemaModified:false,androidIdentityModified:false}));
