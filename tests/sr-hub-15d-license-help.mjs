// Authentic browser capture: serve unmodified game files; use public UI and keyboard only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {chromium} from 'playwright-core';
const root=path.resolve('web'),out='qa-results/sr-hub-15d';
fs.mkdirSync(out,{recursive:true});
const missing=[],errors=[],records=[];
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.json':'application/json'};
const srv=http.createServer((req,res)=>{
 const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '')||'index.html';
 if(rel==='favicon.ico'){res.writeHead(204);return res.end()}
 const p=path.resolve(root,rel);
 if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){missing.push(rel);res.writeHead(404);return res.end()}
 res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream','Cache-Control':'no-store'});
 res.end(fs.readFileSync(p));
});
await new Promise(resolve=>srv.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const [w,h] of [[1280,720],[915,412]]){
  const context=await browser.newContext({viewport:{width:w,height:h}});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const url='http://127.0.0.1:'+srv.address().port;
  await page.goto(url,{waitUntil:'load'});
  const action=a=>page.locator('button[data-action="'+a+'"]:visible').first();
  const snap=async(label)=>{
   const file=out+'/'+label+'-'+w+'x'+h+'.png';
   await page.screenshot({path:file,animations:'disabled'});
   records.push({file,width:w,height:h,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),scope:'unmodified browser runtime; automated ordinary input; visual review pending'});
  };
  await action('help').click();
  const disclosure=page.locator('details[aria-label="Third-party licenses"]:visible');
  await disclosure.waitFor({state:'visible'});
  assert.equal(await disclosure.getAttribute('open'),null);
  await disclosure.locator('summary').click();
  const notice=disclosure.locator('#third-party-notice-text');
  await notice.waitFor({state:'visible'});
  const text=await notice.textContent();
  assert.equal(crypto.createHash('sha256').update(text).digest('hex'),'b305550572976a487eeea8474bedc12dfa74c3ff8212497fe4517bd6f68cb66d');
  await context.setOffline(true);
  await disclosure.locator('summary').click();
  await disclosure.locator('summary').click();
  assert.equal(await notice.textContent(),text);
  await snap('offline-licenses');
  await action('help-back').click();
  await action('modes').waitFor({state:'visible'});
  console.log('SR_HUB_15D_HELP_PASS '+w+'x'+h);
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(out+'/inventory.json',JSON.stringify({source:process.env.GITHUB_SHA,scope:'real browser runtime; no state injection; not physical Android or proof of combat intensity',records},null,2)+'\n');
 console.log('SR_HUB_15D_CAPTURE_PASS '+records.length);
}finally{await browser.close();await new Promise(resolve=>srv.close(resolve))}
