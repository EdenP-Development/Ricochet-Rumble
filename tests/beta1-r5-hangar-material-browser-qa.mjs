import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright-core';
const root=path.resolve('web');
const base='0f363a6c1bd717abf3b846d6c5cf6161d068031d';
const before=execFileSync('git',['show',base+':web/style.css'],{encoding:'utf8'});
const after=fs.readFileSync('web/style.css','utf8');
assert.notEqual(after,before);
const a=before.split('\n'),b=after.split('\n');
assert.equal(a.length,b.length);
const changes=a.flatMap((line,i)=>line===b[i]?[]:[[line.trim(),b[i].trim()]]);
assert.equal(changes.length,5);
for(const [old,next] of changes) assert.match(old,/^(border-color|background|box-shadow):/),assert.equal(old.split(':')[0],next.split(':')[0]);
assert.equal(after,fs.readFileSync('android/app/src/main/assets/style.css','utf8'));
for(const n of ['game.js','index.html','scored-match.js','dossier.js','save-backup.js']){
 assert.equal(fs.readFileSync('web/'+n,'utf8'),execFileSync('git',['show',base+':web/'+n],{encoding:'utf8'}));
 assert.equal(fs.readFileSync('web/'+n,'utf8'),fs.readFileSync('android/app/src/main/assets/'+n,'utf8'));
}
const html=fs.readFileSync('web/index.html','utf8');
const server=http.createServer((req,res)=>{
 const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/,'');
 if(p==='baseline.css'){res.setHeader('Content-Type','text/css');return res.end(before)}
 if(p==='baseline.html'){res.setHeader('Content-Type','text/html');return res.end(html.replace('href="style.css"','href="baseline.css"'))}
 if(p==='favicon.ico'){res.writeHead(204);return res.end()}
 const t=path.resolve(root,p||'index.html');
 if(!t.startsWith(root+path.sep)||!fs.existsSync(t)||!fs.statSync(t).isFile()){res.writeHead(404);return res.end()}
 res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.css')?'text/css':p.endsWith('.svg')?'image/svg+xml':'text/html');res.end(fs.readFileSync(t));
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const report=[];fs.mkdirSync('qa-screens/beta1-r5',{recursive:true});fs.mkdirSync('qa-results/beta1-r5',{recursive:true});
try{
 for(const [width,height] of [[568,320],[640,360],[740,360],[915,412],[1280,720]]){
  const pair=[];
  for(const kind of ['baseline','candidate']){
   const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/'+(kind==='baseline'?'baseline.html':'index.html'));
   await page.locator('#menu button[data-action="hangar"]').click();
   const bay=page.locator('.hangar-bay'),plate=page.locator('.beta1-warm-hangar-plate');
   await bay.waitFor();
   assert.equal(await bay.getAttribute('data-hangar-study'),'warm');
   const result=await bay.evaluate(el=>({materials:[el,...el.querySelectorAll('.beta1-warm-hangar-plate,.hangar-bay-caption,.hangar-bay-foot,#hangar-unit-preview')].map(b=>{const s=getComputedStyle(b),r=b.getBoundingClientRect();return {shadow:s.boxShadow,bg:s.backgroundImage,rect:[r.x,r.y,r.width,r.height],pointer:s.pointerEvents,z:s.zIndex}})}));
   assert.equal(await plate.evaluate(el=>getComputedStyle(el).pointerEvents),'none');
   assert.ok(await plate.evaluate(el=>getComputedStyle(el).backgroundImage.includes('hangar-warm-empty-v1.svg')));
   assert.equal(await page.locator('#hangar-unit-preview').evaluate(el=>getComputedStyle(el).zIndex),'1');
   await page.screenshot({path:'qa-screens/beta1-r5/'+kind+'-'+width+'x'+height+'.png',animations:'disabled'});
   await page.locator('.hangar-tabs button[data-hangar-tab="insignia"]').click();
   await page.locator('.hangar-tabs button[data-hangar-tab="paint"]').click();
   await page.locator('[data-action="hangar-preview-unit"]').click();
   assert.match(await page.locator('#hangar-unit-label').innerText(),/MECH/);
   await page.locator('#menu button[data-action="hangar-back"]').click();
   assert.ok(await page.locator('.home-screen').isVisible());
   assert.deepEqual(errors,[]);
   pair.push(result);await ctx.close();
  }
  assert.deepEqual(pair[0].materials.map(x=>x.rect),pair[1].materials.map(x=>x.rect));assert.notDeepEqual(pair[0].materials,pair[1].materials);assert.deepEqual(pair[0].materials.map(x=>[x.pointer,x.z]),pair[1].materials.map(x=>[x.pointer,x.z]));report.push({width,height,baseline:pair[0],candidate:pair[1]});
 }
 fs.writeFileSync('qa-results/beta1-r5/comparison.json',JSON.stringify({result:'PASS',report},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r))}
