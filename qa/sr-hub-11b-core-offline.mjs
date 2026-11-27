// Disposable Android emulator only. CDP observation begins after startup.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const stage=process.argv[2];
assert.ok(['connected','offline','reconnected'].includes(stage));
const requests=[];
let checkpoint='connect';
const mark=s=>{checkpoint=s;console.log('SR_HUB_11B_CHECKPOINT '+stage+' '+s)};
async function pageTarget(){
  let lastError='';
  for(let i=0;i<35;i++){
    try{
      const rsp=await fetch('http://127.0.0.1:9222/json',{signal:AbortSignal.timeout(2000)});
      if(!rsp.ok)throw new Error('HTTP '+rsp.status);
      const tabs=await rsp.json();
      const tab=tabs.find(t=>t.type==='page'&&t.url?.includes('android_asset/index.html')&&t.webSocketDebuggerUrl);
      if(tab)return tab;
      lastError='No game WebView debugging page in '+JSON.stringify(tabs.map(t=>({type:t.type,url:t.url})));
    }catch(e){lastError=String(e.message||e)}
    await pause(400);
  }
  throw Error('WebView CDP not accessible: '+lastError);
}
class CDP {
  constructor(ws){this.ws=ws;this.id=0;this.pending=new Map();
    ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch{return} if(m.method==='Network.requestWillBeSent') requests.push({url:m.params.request.url,method:m.params.request.method});
      const p=this.pending.get(m.id);if(!p)return;this.pending.delete(m.id);
      if(m.error)p.reject(new Error(JSON.stringify(m.error)));else p.resolve(m.result);
    };
    ws.onclose=()=>{for(const p of this.pending.values())p.reject(Error('CDP connection closed'));this.pending.clear()};
  }
  call(method,params={}){
    const id=++this.id;
    return new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>{this.pending.delete(id);reject(new Error('CDP timeout '+method))},45000);
      this.pending.set(id,{resolve:v=>{clearTimeout(timeout);resolve(v)},reject:e=>{clearTimeout(timeout);reject(e)}});
      this.ws.send(JSON.stringify({id,method,params}));
    });
  }
  async eval(expression){
    const answer=await this.call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(answer.exceptionDetails)throw Error('WebView JS exception: '+JSON.stringify(answer.exceptionDetails));
    return answer.result?.value;
  }
  close(){this.ws.close()}
}
async function connection(){
  const target=await pageTarget();
  const ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(Error('WebView WebSocket timeout')),12000);
    ws.onopen=()=>{clearTimeout(timer);resolve()};
    ws.onerror=()=>{clearTimeout(timer);reject(Error('WebView WebSocket failure'))};
  });
  return new CDP(ws);
}

const session=await connection();
try{
 mark('enable-network');await session.call('Network.enable');
 await session.call('Page.enable');
 const state=await session.eval('({url:location.href,title:document.title,online:navigator.onLine,home:!!document.querySelector(\'button[data-action="dossier"]\')})');
 assert.ok(state.url.startsWith('file:///android_asset/index.html'));
 assert.equal(state.title,'Sector Rebound');assert.ok(state.home);
 // Reload with observation active; this covers page loading, not earlier native startup.
 mark('reload');await session.call('Page.reload');
 await pause(6000);
 mark('reload-ready');assert.ok(await session.eval('document.readyState === "complete" && !!document.querySelector(\'button[data-action="dossier"]\')'));
 const click=async action=>{mark('click-'+action);assert.equal(await session.eval('(()=>{const b=document.querySelector('+JSON.stringify('button[data-action="'+action+'"]')+');if(!b||!b.getClientRects().length)return false;b.click();return true})()'),true,action);await pause(350)};
 // Seed only a valid synthetic portable record; cosmetic UI interaction is a separate unresolved test.
 mark('seed-synthetic-record');
 const seeded=await session.eval('(()=>{const k="rr-hangar-paint-v1";const v=JSON.stringify({version:1,equipped:"fieldgrid.moss",emblem:"mark.field"});localStorage.setItem(k,v);return localStorage.getItem(k)===v})()');
 assert.equal(seeded,true,'synthetic storage fixture');
 await click('dossier');assert.ok(await session.eval('!!document.querySelector("#dossier-matches")'));
 await click('backup');await click('backup-export');
 mark('validate-backup');const evidence=await session.eval('(()=>{const v=document.querySelector("#backup-output")?.value||"";const check=window.SectorBackup?.checkedEntries(v);return {length:v.length,valid:check?.ok===true,paint:check?.ok?JSON.parse(check.entries["rr-hangar-paint-v1"]||"null")?.equipped:null,message:document.querySelector("#backup-message")?.textContent}})()');
 assert.ok(evidence.length>20&&evidence.length<=60000&&evidence.valid&&evidence.paint==='fieldgrid.moss','backup failed: '+JSON.stringify(evidence));
 // No share/copy/import action; never archive backup payload.
 await click('backup-back');await click('dossier-back');
 await click('modes');await click('practice');
 await pause(2500);
 mark('verify-practice');const practice=await session.eval('({canvas:!!document.querySelector("#game-screen canvas"),menu:!!document.querySelector("#menu-button")?.getClientRects().length})');
 assert.ok(practice.canvas&&practice.menu);
 const external=requests.filter(r=>/^https?:|^wss?:/i.test(r.url));
 assert.equal(external.length,0,'unexpected external WebView request');
 const report={stage,state,practice,fixture:'synthetic storage record, not cosmetic UI acceptance',backupGenerated:true,backupValidation:{length:evidence.length,valid:evidence.valid,paintVerified:true},requests:requests.map(r=>({scheme:r.url.split(':')[0],method:r.method})),externalRequests:external.length,scope:'observed CDP page reload and navigation only; not native socket capture or full combat'};
 fs.mkdirSync('qa-results/sr-hub-11b',{recursive:true});
 fs.writeFileSync('qa-results/sr-hub-11b/'+stage+'.json',JSON.stringify(report,null,2)+'\n');
 console.log('SR_HUB_11B_WEBVIEW_PASS '+stage+' requests='+requests.length+' external='+external.length);
}catch(e){console.error('SR_HUB_11B_FAILURE '+stage+' '+checkpoint+' '+e.message);throw e;}finally{session.close()}
