// Structural release evidence validator. Does not authenticate evidence or authorize publication.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
export const gates=['automated','permissions','runtime','nativeNetwork','physical','saveUpgrade','exportRestore','rights','privacy','support','storefront','custody','signerPreflight','archive','ownerApproval'];
const sha=(v,n)=>typeof v==='string'&&new RegExp('^[0-9a-f]{'+n+'}$').test(v);
const pinnedCert='43840f1525c03a5279fa4d76723b593779fad5837c655296f182cb642e4656c7';
export function assess(r){
 const errors=[], blockers=[];
 const require=(ok,msg)=>{if(!ok)errors.push(msg)};
 require(r?.schemaVersion===1,'schemaVersion');
 require(r?.product==='Sector Rebound'&&r?.channel==='itch.io/android/beta1','product/channel');
 const c=r?.candidate??{};
 require(sha(c.source,40)&&sha(c.apkSha256,64),'candidate source/APK hash');
 require(c.package==='com.playereden.ricochetrumble.beta','beta package identity');
 require(Number.isInteger(c.versionCode)&&c.versionCode>0&&c.versionCode<=2100000000,'versionCode');
 require(typeof c.versionName==='string'&&/^\d+\.\d+\.\d+-beta\.\d+$/.test(c.versionName),'versionName');
 require(['unsigned','signed'].includes(c.scope),'candidate scope');
 if(c.scope!=='signed')blockers.push('unsigned candidate');
 if(c.scope==='signed')require(c.certificateSha256===pinnedCert,'original beta signer');
 else require(c.certificateSha256===null,'unsigned certificate must be null');
 require(typeof c.run==='string'&&/^\d+$/.test(c.run),'build run ID');
 const b=r?.baseline??{};
 require(b.kind==='first-release'||b.kind==='update','baseline kind');
 if(b.kind==='first-release')require(b.previous===null&&typeof b.rationale==='string'&&b.rationale.trim().length>0,'first release rationale');
 if(b.kind==='update'){
  const p=b.previous??{};
  require(p.package===c.package&&p.certificateSha256===pinnedCert&&sha(p.apkSha256,64)&&sha(p.source,40)&&Number.isInteger(p.versionCode)&&p.versionCode>0&&p.versionCode<c.versionCode,'prior accepted compatible identity/version/hash');
 }
 for(const g of gates){
  const e=r?.gates?.[g];
  require(e&&['passed','failed','pending'].includes(e.status),'gate '+g+' status');
  if(e?.status!=='passed'){blockers.push(g+': '+(e?.status??'missing'));continue;}
  require(e.source===c.source&&e.apkSha256===c.apkSha256,'stale evidence '+g);
  require(typeof e.reference==='string'&&e.reference.trim().length>0,'missing evidence '+g);
 }
 require(Object.keys(r?.gates??{}).every(k=>gates.includes(k)),'unknown gate');
 // Separate owner approval and archive/download verification; never a deploy command.
 const approval=r?.authorization;
 if(approval?.approved!==true)blockers.push('explicit owner authorization missing');
 else require(approval.source===c.source&&approval.apkSha256===c.apkSha256&&approval.channel===r.channel&&typeof approval.reference==='string'&&approval.reference.trim().length>0,'authorization binding');
 return {schemaValid:errors.length===0,structurallyComplete:errors.length===0&&blockers.length===0,errors,blockers,notice:'Structural check only. Evidence authenticity, physical acceptance and publication authorization require independent verification.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const r=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
 const result=assess(r);console.log(JSON.stringify(result,null,2));
 if(!result.schemaValid||process.argv.includes('--require-complete')&&!result.structurallyComplete)process.exitCode=1;
}
