import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sr-archive-fixture-'));
try{
 const file=path.join(dir,'123.zip'), inv=path.join(dir,'inventory.json'), bytes=Buffer.from('synthetic ZIP byte fixture');
 const r={id:123,size:bytes.length,zipSha256:crypto.createHash('sha256').update(bytes).digest('hex')};
 const write=records=>fs.writeFileSync(inv,JSON.stringify({schemaVersion:1,repository:'EdenP-Development/Ricochet-Rumble',records}));
 const run=()=>spawnSync(process.execPath,['tools/sr-hub-12d-archive-check.mjs',inv,dir],{encoding:'utf8'});
 write([r]);fs.writeFileSync(file,bytes);assert.equal(run().status,0);
 fs.unlinkSync(file);assert.equal(run().status,1);
 fs.writeFileSync(file,Buffer.from('short'));assert.equal(run().status,1);
 fs.writeFileSync(file,Buffer.alloc(bytes.length,0));assert.equal(run().status,1);
 fs.writeFileSync(file,bytes);write([r,r]);assert.equal(run().status,1);
 write([{...r,id:'../123'}]);assert.equal(run().status,1);
 console.log('SR_HUB_12D_ARCHIVE_FIXTURE_PASS 6');
}finally{fs.rmSync(dir,{recursive:true,force:true})}
