// B1-R2 computed-cascade A/B: actual unchanged app and real Chromium.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright-core';
const root=path.resolve('web');
const baseline=execFileSync('git',['show','origin/audit/beta1-refinement-baseline-2026-11-25:web/style.css'],{encoding:'utf8'});
const current=fs.readFileSync('web/style.css','utf8');
assert.notEqual(current,baseline);
for(const name of ['game.js','index.html','dossier.js','scored-match.js','save-backup.js'])
 assert.equal(fs.readFileSync('web/'+name,'utf8'),fs.readFileSync('android/app/src/main/assets/'+name,'utf8'));
assert.equal(current,fs.readFileSync('android/app/src/main/assets/style.css','utf8'));
const originalHtml=fs.readFileSync('web/index.html','utf8');
assert.match(originalHtml,/<link rel="stylesheet" href="style\.css">/);
const server=http.createServer((req,res)=>{
 const parsed=new URL(req.url,'http://127.0.0.1');
 const p=decodeURIComponent(parsed.pathname).replace(/^\/+/,'');
 if(p==='favicon.ico'){res.writeHead(204);res.end();return}
 if(p==='baseline-style.css'){res.writeHead(200,{'Content-Type':'text/css'});res.end(baseline);return}
 if(p==='baseline-index.html'){res.writeHead(200,{'Content-Type':'text/html'});res.end(originalHtml.replace('href="style.css"','href="baseline-style.css"'));return}
 const target=path.resolve(root,p||'index.html');
 if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('not found '+p);return}
 res.writeHead(200,{'Content-Type':p.endsWith('.css')?'text/css':p.endsWith('.svg')?'image/svg+xml':p.endsWith('.js')?'application/javascript':'text/html'});
 res.end(fs.readFileSync(target));
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const dest='qa-results/beta1-r2',shots='qa-screens/beta1-r2';
fs.mkdirSync(dest,{recursive:true});fs.mkdirSync(shots,{recursive:true});
const report=[],errors=[];
const modes=[['cqc','cqc'],['ffa','scored_ffa'],['tdm','scored_tdm'],['custom','custom']];
async function check(width,height,kind){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(width+'x'+height+' / '+kind+' '+e.message));
 await page.goto(origin+(kind==='baseline'?'/baseline-index.html':'/index.html'),{waitUntil:'load',timeout:30000});
 await page.locator('#menu button[data-action="modes"]').click({timeout:10000});
 const cards=[];
 for(const [id,action] of modes){
  const el=page.locator('.mode-grid button.mode-'+id);
  assert.equal(await el.getAttribute('data-action'),action);
  assert.equal(await el.isVisible(),true);
  const item=await el.evaluate(node=>{
   const s=getComputedStyle(node),title=node.querySelector('.mode-copy strong'),caption=node.querySelector('.mode-copy small');
   const b=node.getBoundingClientRect(),art=getComputedStyle(node,'::before'),cx=b.left+b.width/2,cy=b.top+b.height/2;
   const hit=document.elementFromPoint(cx,cy);
   return {bg:s.backgroundImage,shadow:s.boxShadow,title:getComputedStyle(title).color,caption:getComputedStyle(caption).color,
    rect:{x:b.x,y:b.y,width:b.width,height:b.height},hit:node===hit||node.contains(hit),
    image:art.backgroundImage,pointer:art.pointerEvents,action:node.dataset.action};
  });
  assert.equal(item.hit,true,'real card center stays clickable '+id);
  assert.equal(item.pointer,'none','illustration cannot intercept clicks');
  assert.ok(item.image.includes('mode-'+id+'-study-v1.svg'));
  assert.ok(item.rect.height>=43,'minimum vertical target '+id);
  if(kind==='candidate'){
   assert.ok(item.bg.includes('rgb(23, 47, 60)'),'new intended B1 background applied '+id+' '+item.bg);
   assert.equal(item.title,'rgb(244, 246, 241)','updated main label hierarchy '+id);
   assert.equal(item.caption,'rgb(189, 212, 214)','updated secondary copy contrast '+id);
  }
  cards.push({id,...item});
 }
 if(kind==='candidate'){
  const first=page.locator('.mode-grid .mode-cqc');
  await first.focus();assert.equal(await first.evaluate(el=>el===document.activeElement),true);
  await page.locator('.mode-head button[data-action="modes-back"]').click();
  assert.equal(await page.locator('.home-screen').isVisible(),true);
  await page.locator('#menu button[data-action="modes"]').click();
 }
 await page.screenshot({path:shots+'/'+kind+'-'+width+'x'+height+'.png',animations:'disabled'});
 await context.close();
 return cards;
}
try{
 for(const [w,h] of [[568,320],[640,360],[740,360],[915,412],[1280,720]]){
  const before=await check(w,h,'baseline'),after=await check(w,h,'candidate');
  for(let i=0;i<4;i++){
   const b=before[i],a=after[i];
   for(const key of ['x','y','width','height'])
    assert.ok(Math.abs(b.rect[key]-a.rect[key])<1,'no hitbox/layout movement: '+a.id+' '+key);
   assert.equal(b.action,a.action,'mode navigation action parity');
   assert.notEqual(b.bg,a.bg,'previously shadowed intended new background now active');
   assert.notEqual(b.title,a.title,'previously shadowed title contrast now active');
   assert.notEqual(b.caption,a.caption,'previously shadowed small-label contrast now active');
  }
  report.push({viewport:w+'x'+h,cardCount:4,verifiedCascade:true,geometryUnchanged:true,actionsUnchanged:true,baseline:before,candidate:after});
 }
 assert.deepEqual(errors,[],'no real browser exceptions');
 fs.writeFileSync(dest+'/comparison.json',JSON.stringify({result:'PASS',source:'live Chromium baseline vs selected CSS-only change',viewports:report},null,2)+'\n');
 console.log('BETA1_R2_CASCADE_BROWSER_PASS '+JSON.stringify({screens:report.length,cards:20,hitboxesStable:true,realBrowser:true}));
}finally{await browser.close();await new Promise(done=>server.close(done))}
