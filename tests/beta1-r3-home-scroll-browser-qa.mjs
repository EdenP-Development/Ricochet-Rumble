import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright-core';
const root=path.resolve('web');
const base='accb09d19e7efdae5a04e0739f6db61e1b5c2f49';
const before=execFileSync('git',['show',base+':web/style.css'],{encoding:'utf8'});
const after=fs.readFileSync('web/style.css','utf8');
const old='  scrollbar-width:none;\n}\n#menu .home-actions::-webkit-scrollbar{display:none}';
const replacement='  scrollbar-width:thin;\n  scrollbar-color:#78a6b1 #142732;\n}\n#menu .home-actions::-webkit-scrollbar{width:5px}\n#menu .home-actions::-webkit-scrollbar-thumb{background:#78a6b1;border-radius:3px}\n#menu .home-actions::-webkit-scrollbar-track{background:#142732}';
assert.equal(before.split(old).length,2);
assert.equal(after,before.replace(old,replacement));
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
const report=[];fs.mkdirSync('qa-screens/beta1-r3',{recursive:true});fs.mkdirSync('qa-results/beta1-r3',{recursive:true});
try{
 for(const [width,height] of [[568,320],[640,360],[740,360],[915,412],[1280,720]]){
  const pair=[];
  for(const kind of ['baseline','candidate']){
   const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/'+(kind==='baseline'?'baseline.html':'index.html'));
   const panel=page.locator('.home-actions');await panel.waitFor();
   const result=await panel.evaluate(el=>({scrollbar:getComputedStyle(el).scrollbarWidth,overflow:getComputedStyle(el).overflowY,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,actions:[...el.querySelectorAll('button[data-action]')].map(b=>b.dataset.action)}));
   assert.equal(result.scrollbar,kind==='baseline'?'none':'thin');assert.equal(result.overflow,'auto');
   await page.screenshot({path:'qa-screens/beta1-r3/'+kind+'-'+width+'x'+height+'.png',animations:'disabled'});
   for(const action of result.actions){
    const button=panel.locator('button[data-action="'+action+'"]');await button.scrollIntoViewIfNeeded();await button.focus();
    assert.equal(await button.evaluate(b=>b===document.activeElement),true);
    assert.equal(await button.evaluate(b=>{const r=b.getBoundingClientRect(),h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return b===h||b.contains(h)}),true,'reachable '+action);
   }
   await panel.locator('button[data-action="modes"]').click();await page.locator('.mode-screen').waitFor();assert.deepEqual(errors,[]);
   pair.push(result);await ctx.close();
  }
  assert.deepEqual(pair[0].actions,pair[1].actions);report.push({width,height,baseline:pair[0],candidate:pair[1]});
 }
 fs.writeFileSync('qa-results/beta1-r3/comparison.json',JSON.stringify({result:'PASS',report},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r))}
