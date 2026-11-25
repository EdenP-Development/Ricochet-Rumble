// B1-03-D: production-style, unflagged 5-viewport Solo match arc and
// spectator camera acceptance; derived from original M13-B fixture.
// This is the unflagged current Beta1 candidate: preserve baseline 10/15/10.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const base='37460159dd68d9cced787b96c17294ae0a1badfa';
const before=execFileSync('git',['show',base+':web/style.css'],{encoding:'utf8'});
const after=fs.readFileSync('web/style.css','utf8');
assert.equal(after,fs.readFileSync('android/app/src/main/assets/style.css','utf8'));
const a=before.split('\n'),b=after.split('\n');assert.equal(a.length,b.length);
const changes=a.flatMap((x,i)=>x===b[i]?[]:[[x,b[i]]]);assert.equal(changes.length,6);
for(const [old,next] of changes)assert.match(next,/background:/);
for(const n of ['game.js','index.html','scored-match.js','dossier.js','save-backup.js'])assert.equal(fs.readFileSync('web/'+n,'utf8'),execFileSync('git',['show',base+':web/'+n],{encoding:'utf8'}));
import {chromium} from 'playwright-core';
assert.ok(process.env.CHROME_BIN,'Real Chromium required');
const root=path.resolve('web'),source=fs.readFileSync('web/game.js','utf8');
const end=/\}\)\(\);\s*$/;assert.match(source,end);
function hooks(){
 window.__arcQa={
  start(id='survival_ffa'){
   mode='solo';paused=false;menu.classList.add('hidden');
   state=initialState(0,{...selectedRules,matchModeId:id,
    teamMode:['scored_tdm','survival_teams'].includes(id)?'teams':'ffa',
    mapSize:id==='cqc'?'small':'standard',botCount:3,startLives:3,pilotMode:true},12345);
   lastMatchArcStage=null;lastMatchArcId=state.matchId;state.elapsedSeconds=0;
   refreshHUD();return this.read();
  },
  stage(kind){
   if(kind==='engagement'){state.elapsedSeconds=27;
    if(state.scored)state.scored=Object.freeze({...state.scored,elapsedSeconds:27});
   }
   if(kind==='final'){
    state.elapsedSeconds=55;
    if(state.scored){
     const scores=[...state.scored.operatorKOs];scores[1]=Math.ceil(state.scored.scoreTarget*.8);
     state.scored=Object.freeze({...state.scored,elapsedSeconds:55,operatorKOs:Object.freeze(scores)});
    }else{state.lives[2]=0;state.lives[3]=0;state.deaths[2]=1;state.deaths[3]=1;}
   }
   if(kind==='pause')paused=true;
   if(kind==='resume')paused=false;
   refreshHUD();return this.read();
  },
  watch(){
   this.start('survival_ffa');
   state.lives[0]=0;state.winner=-1;refreshHUD();render(1/60);
   return this.readWatch();
  },
  readWatch(){
   const target=soloWatchTarget(),seat=soloWatchSeat;
   return {active:soloWatchActive(),seat,targetAlive:seat!==null&&state.lives[seat]>0,
    visible:!document.getElementById('solo-watch-bar').classList.contains('hidden'),
    label:document.getElementById('solo-watch-label').textContent,
    controlHidden:document.getElementById('game-screen').classList.contains('solo-watching'),
    x:target?.x??null,y:target?.y??null};
  },
  eliminateCameraTarget(){
   if(!soloWatchActive())return null;
   state.lives[soloWatchSeat]=0;refreshHUD();render(1/60);return this.readWatch();
  },
  denyWatch(){mode='host';refreshHUD();return {active:soloWatchActive(),
   barHidden:document.getElementById('solo-watch-bar').classList.contains('hidden')}},
  lan(){mode='host';paused=false;refreshHUD();return this.read()},
  read(){
   const clock=document.getElementById('score-clock'),phase=matchArcFor();
   return {phase:phase?.stage??null,text:clock.textContent,
    visible:!clock.classList.contains('hidden'),arc:clock.classList.contains('match-arc'),
    aria:clock.getAttribute('aria-label'),
    target:state.scored?.scoreTarget??null,cap:state.scored?.clockSeconds??null};
  }
 };
}
const injected=source.replace(end,'\n('+hooks.toString()+')();\n})();');
const missing=[];
const srv=http.createServer((req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname).replace(/^\/+/,'')||'index.html';
 if(name==='baseline.css'){res.writeHead(200,{'Content-Type':'text/css'});res.end(before);return;}
 if(name==='baseline.html'){res.writeHead(200,{'Content-Type':'text/html'});res.end(fs.readFileSync('web/index.html','utf8').replace('href="style.css"','href="baseline.css"'));return;}
 if(name==='favicon.ico'){res.writeHead(204);res.end();return;}
 const target=path.resolve(root,name);
 if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){
  missing.push(name);res.writeHead(404);res.end();return;
 }
 res.writeHead(200,{'Content-Type':name.endsWith('.js')?'text/javascript':
  name.endsWith('.css')?'text/css':name.endsWith('.svg')?'image/svg+xml':'text/html',
  'Cache-Control':'no-store'});
 res.end(name==='game.js'?injected:fs.readFileSync(target));
});
await new Promise(done=>srv.listen(0,'127.0.0.1',done));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN,args:['--no-sandbox','--disable-dev-shm-usage']});
const output='qa-results/beta1-r8';fs.mkdirSync(output,{recursive:true});
const sizes=[[568,320],[640,360],[740,360],[915,412],[1280,720]],results=[],errors=[];
const intersects=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&
 Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;
try{
 for(const [w,h] of sizes){
  const ctx=await browser.newContext({viewport:{width:w,height:h}}),page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(w+'x'+h+' '+e.message));
  await page.goto('http://127.0.0.1:'+srv.address().port,{waitUntil:'load'});
  await page.waitForFunction(()=>!!window.__arcQa);
  const captures=[];
  for(const kind of ['baseline','candidate']){
   await page.goto('http://127.0.0.1:'+srv.address().port+(kind==='baseline'?'/baseline.html':'/index.html'),{waitUntil:'load'});
   await page.waitForFunction(()=>!!window.__arcQa);
   const states=[];
   await page.evaluate(()=>window.__arcQa.start('scored_ffa'));
   for(const stage of ['deployment','engagement','final']){
    const phase=stage==='deployment'?await page.evaluate(()=>window.__arcQa.read()):await page.evaluate(s=>window.__arcQa.stage(s),stage);
    assert.equal(phase.phase,stage);
    const items=await page.evaluate(()=>['#score-clock','.scorestrip','.scorestrip>span','.scorestrip .middle','#menu-button','.joystick','.fire-btn'].map(sel=>{const e=document.querySelector(sel),s=getComputedStyle(e),r=e.getBoundingClientRect();return {sel,bg:s.backgroundImage,color:s.backgroundColor,rect:[r.x,r.y,r.width,r.height],pointer:s.pointerEvents}}));
    await page.screenshot({path:output+'/'+kind+'-'+stage+'-'+w+'x'+h+'.png',animations:'disabled'});
    states.push({phase,items});
   }
   captures.push(states);
  }
  for(let i=0;i<3;i++){
   const [a,b]=captures.map(x=>x[i]);
   assert.equal(a.phase.phase,b.phase.phase);assert.equal(a.phase.target,b.phase.target);assert.equal(a.phase.cap,b.phase.cap);
   assert.deepEqual(a.items.map(x=>[x.rect,x.pointer]),b.items.map(x=>[x.rect,x.pointer]));
   assert.notEqual(a.items[0].bg,b.items[0].bg);
  }
  results.push({viewport:w+'x'+h,captures});
  await ctx.close();
 }
 assert.deepEqual(errors,[],'Browser exceptions');
 assert.deepEqual(missing,[],'All local app/asset URLs must resolve');
 fs.writeFileSync(output+'/comparison.json',JSON.stringify({result:'PASS',results},null,2)+'\n');
 console.log('BETA1_R8_REAL_BROWSER_PASS '+JSON.stringify({viewports:results.length,
  stages:3,geometryPreserved:true}));
}finally{await browser.close();await new Promise(done=>srv.close(done))}
