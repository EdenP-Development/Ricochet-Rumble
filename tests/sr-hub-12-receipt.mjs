import assert from 'node:assert/strict';
import {assess,gates} from '../tools/sr-hub-12-release-receipt.mjs';
const source='a'.repeat(40),apkSha256='b'.repeat(64),cert='43840f1525c03a5279fa4d76723b593779fad5837c655296f182cb642e4656c7';
const make=()=>({schemaVersion:1,product:'Sector Rebound',channel:'itch.io/android/beta1',candidate:{source,apkSha256,package:'com.playereden.ricochetrumble.beta',versionCode:2,versionName:'0.9.80-beta.2',scope:'signed',certificateSha256:cert,run:'123'},baseline:{kind:'first-release',previous:null,rationale:'Synthetic first release test'},gates:Object.fromEntries(gates.map(g=>[g,{status:'passed',source,apkSha256,reference:'synthetic fixture only'}])),authorization:{approved:true,source,apkSha256,channel:'itch.io/android/beta1',reference:'synthetic approval only'}});
assert.equal(assess(make()).structurallyComplete,true);
let count=1;
function reject(label,change){const r=make();change(r);assert.equal(assess(r).structurallyComplete,false,label);count++}
reject('unsigned',r=>{r.candidate.scope='unsigned';r.candidate.certificateSha256=null});
reject('wrong signer',r=>r.candidate.certificateSha256='c'.repeat(64));
reject('QA identity',r=>r.candidate.package='com.playereden.ricochetrumble.privacyqa');
reject('missing source',r=>delete r.candidate.source);
reject('invalid version',r=>r.candidate.versionCode=0);
reject('missing authorization',r=>delete r.authorization);
reject('wrong approval hash',r=>r.authorization.apkSha256='d'.repeat(64));
reject('wrong channel approval',r=>r.authorization.channel='play');
reject('fictional first release baseline',r=>r.baseline.previous={});
reject('missing previous version',r=>r.baseline.kind='update');
reject('nonincreasing version',r=>r.baseline={kind:'update',previous:{...r.candidate}});
for(const g of gates){
 reject('pending '+g,r=>r.gates[g]={status:'pending'});
 reject('failed '+g,r=>r.gates[g]={status:'failed'});
 reject('stale '+g,r=>r.gates[g].apkSha256='f'.repeat(64));
 reject('missing reference '+g,r=>delete r.gates[g].reference);
 reject('absent '+g,r=>delete r.gates[g]);
}
reject('unknown gate',r=>r.gates.extra={status:'passed'});
const update=make();update.baseline={kind:'update',previous:{...update.candidate,versionCode:1,source:'c'.repeat(40),apkSha256:'d'.repeat(64)}};
assert.equal(assess(update).structurallyComplete,true);count++;
console.log('SR_HUB_12_RECEIPT_FIXTURE_PASS '+count+' synthetic cases only');
