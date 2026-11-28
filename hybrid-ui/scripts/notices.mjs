// Generate exact approved notice bytes from locked runtime dependencies.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const expected={'@pixi/colord':'2.9.6','earcut':'3.2.4','eventemitter3':'5.0.4','ismobilejs':'1.1.1','parse-svg-path':'0.1.2','pixi.js':'8.18.0'};
const lines=[];
for(const [name,version] of Object.entries(expected)){
 const dir=path.join(root,'hybrid-ui/node_modules',name);
 const p=JSON.parse(fs.readFileSync(path.join(dir,'package.json'),'utf8'));
 assert.equal(p.version,version);
 assert.equal(p.license,name==='earcut'?'ISC':'MIT');
 const file=name==='@pixi/colord'?path.join(root,'docs/third-party/pixi-colord-2.9.6-LICENSE.md'):path.join(dir,fs.readdirSync(dir).find(n=>/^licen[cs]e(?:\.|$)/i.test(n))||'MISSING');
 lines.push(name+' '+version+' ('+p.license+')\n'+fs.readFileSync(file,'utf8'));
}
const notice=lines.join('\n\n');
const hash=crypto.createHash('sha256').update(notice).digest('hex');
assert.equal(hash,'b305550572976a487eeea8474bedc12dfa74c3ff8212497fe4517bd6f68cb66d','Notice content changed: review dependencies and licenses before approving new digest');
for(const dir of ['web','android/app/src/main/assets'])fs.writeFileSync(path.join(root,dir,'THIRD_PARTY_NOTICES.txt'),notice);
console.log('SR_HUB_15C_NOTICE_GENERATION_PASS '+hash);
