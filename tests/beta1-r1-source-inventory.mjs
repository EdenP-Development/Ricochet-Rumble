// B1-R1 diagnostic-only source/cascade risk inventory.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const css=fs.readFileSync('web/style.css','utf8');
const html=fs.readFileSync('web/index.html','utf8');
const lines=css.split('\n'),out='qa-results/beta1-r1';
fs.mkdirSync(out,{recursive:true});
const media=[],headers=[];
for(let i=0;i<lines.length;i++){
 const line=lines[i].trim();
 if(line.startsWith('@media'))media.push({line:i+1,condition:line.slice(0,130)});
 if(!line||line.startsWith('/*')||line.startsWith('//')||line.startsWith('@'))continue;
 if(line.includes('{')){
  const prefix=line.slice(0,line.indexOf('{')).trim();
  if(/^[.#:[>+~*]/.test(prefix)||/^(html|body|button|canvas|input|section)\b/.test(prefix))
   headers.push({line:i+1,selector:prefix.replace(/\s+/g,' ')});
 }
}
const freq={};
for(const h of headers)(freq[h.selector]??=[]).push(h.line);
const repeated=Object.entries(freq).filter(([,v])=>v.length>=3)
 .sort((a,b)=>b[1].length-a[1].length)
 .slice(0,55).map(([selector,loc])=>({selector,count:loc.length,lines:loc}));
const templates=[...html.matchAll(/<template\s+id="([^"]+)"/g)].map(m=>m[1]);
const actions=[...new Set([...html.matchAll(/\bdata-action="([^"]+)"/g)].map(m=>m[1]))].sort();
const surfaces=[
 ['Home / Startup','Spudacus timing, home textures, mech/tank preview, touch priority'],
 ['Mode Select','Illustration legibility, accurate mode labels, four large hitboxes'],
 ['Warm Hangar','Paint/insignia tab consistency, live preview, locked state'],
 ['Player Dossier','Equipped mark, profile stats, accessible backup'],
 ['Settings / Custom','Nested scroll, toggles, disabled buttons, sticky actions'],
 ['Local LAN','Real two-phone host/join, disconnect/reconnect, safe touch'],
 ['Gameplay HUD','Correct Solo phases, genuine KO counts, thumb zones'],
 ['Survivor Watch','Read-only camera, next-target action, end-of-match exit'],
 ['After Action / Backup','Accurate results, rewards, save and restore'],
 ['Help / Privacy','Clarity of instructions and offline/privacy promises']
];
const sum=x=>crypto.createHash('sha256').update(x).digest('hex');
for(const file of ['game.js','index.html','style.css','dossier.js','scored-match.js','save-backup.js']){
 assert.ok(fs.readFileSync('web/'+file).equals(fs.readFileSync('android/app/src/main/assets/'+file)),file+' Web/Android parity');
}
assert.equal(templates.length,7);
assert.ok(html.includes('id="solo-watch-bar"'));
const report={audit:'Sector Rebound B1-R1 source inventory',physicalPhoneTested:false,
 CSS:{sha256:sum(css),bytes:Buffer.byteLength(css),lines:lines.length,mediaBlocks:media.length,importantOccurrences:css.split('!important').length-1,selectorHeaderHeuristic:headers.length,repeatedSelectorHeaders:repeated,mediaBlocksByLine:media},
 HTML:{sha256:sum(html),templates,uniqueActionCount:actions.length,actions},
 screens:surfaces.map(([name,review])=>({name,ownerReview:review})),
 webAndroidMirrorExact:true,
 note:'Repeated selector starts can be intentional responsive overrides; this is an investigation queue, not a claim of broken rules.'};
fs.writeFileSync(out+'/inventory.json',JSON.stringify(report,null,2)+'\n');
let md='# B1-R1 source inventory — no runtime changes\n\n';
md+='All Web/Android runtime mirror files checked byte-identical. No real device acceptance is implied.\n\n';
md+='| Source metric | Value |\n|---|---:|\n';
for(const [key,val] of Object.entries({CSS_lines:lines.length,CSS_bytes:Buffer.byteLength(css),Media_blocks:media.length,Important_occurrences:css.split('!important').length-1,Selector_header_candidates:headers.length,HTML_templates:templates.length,Unique_actions:actions.length}))
 md+='| '+key.replaceAll('_',' ')+' | '+val+' |\n';
md+='\n## Repeated selector headers — investigate, do not delete blindly\n\n';
md+='| Selector | Occurrences | Line numbers |\n|---|---:|---|\n';
for(const e of repeated.slice(0,35))
 md+='| '+e.selector.replaceAll('|','/')+' | '+e.count+' | '+e.lines.join(', ')+' |\n';
md+='\n## Real phone / functional screen audit queue\n\n';
for(const [name,review] of surfaces)md+='- **'+name+':** '+review+'\n';
md+='\n## Limits\n\nAn entry above can be a deliberate breakpoint override. Confirm actual computed style, overlaps, scrolling and accessibility by viewport before refactoring. This script is a source audit and Web/Android parity check, not a real-device benchmark or a release gate.\n';
fs.writeFileSync(out+'/inventory.md',md);
console.log('BETA1_R1_INVENTORY_PASS '+JSON.stringify({lines:lines.length,media:media.length,important:report.CSS.importantOccurrences,repeatedHeaders:repeated.length,actions:actions.length,templates:templates.length}));
