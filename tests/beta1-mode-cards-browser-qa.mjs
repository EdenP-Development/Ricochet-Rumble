// Actual browser visual/interaction regression for B1-03-B Mode Select.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN,args:['--no-sandbox','--disable-dev-shm-usage']});
const done=[];
const modes={cqc:'cqc',ffa:'scored_ffa',tdm:'scored_tdm',custom:'custom'};
try{
 for(const [width,height] of [[568,320],[740,360],[915,412]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('web/index.html')).href,{waitUntil:'load',timeout:25000});
  await page.locator('#menu button[data-action="modes"]').click({timeout:12000});
  assert.equal(await page.locator('.mode-grid .mode-mission').count(),4);
  const bounds=await page.locator('.mode-screen').boundingBox();
  assert.ok(bounds&&bounds.width>200&&bounds.height>180,'Mode Select fits the viewport');
  for(const [mode,action] of Object.entries(modes)){
   const button=page.locator('.mode-grid .mode-'+mode);
   assert.equal(await button.getAttribute('data-action'),action,'real click target preserved');
   assert.ok(await button.isVisible(),mode+' must remain visible');
   const c=await button.evaluate(el=>{
    const a=getComputedStyle(el,'::before'),b=el.getBoundingClientRect();
    return {image:a.backgroundImage,pointer:a.pointerEvents,opacity:a.opacity,box:{w:b.width,h:b.height},content:a.content};
   });
   assert.ok(c.image.includes('mode-'+mode+'-study-v1.svg'),mode+' real illustrated CSS '+JSON.stringify(c));
   assert.equal(c.pointer,'none',mode+' illustration cannot intercept buttons');
   assert.ok(c.box.w>110&&c.box.h>40,mode+' selectable hitbox');
   assert.ok(c.content!=='none',mode+' artwork layer exists');
  }
  const loaded=await page.evaluate(async()=>{
   const modes=['cqc','ffa','tdm','custom'];
   return Promise.all(modes.map(mode=>new Promise((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>resolve([mode,image.naturalWidth,image.naturalHeight]);
    image.onerror=()=>reject(Error(mode+' illustration failed to load'));
    image.src='assets/m12/mode-'+mode+'-study-v1.svg';
   })));
  });
  for(const [mode,w,h] of loaded)assert.deepEqual([w,h],[512,288],mode+' exact dimensions');
  // Preserve the original accessible names, keyboard focus and navigation.
  const first=page.locator('.mode-grid .mode-cqc');
  await first.focus();
  assert.equal(await first.evaluate(el=>document.activeElement===el),true);
  assert.match(await first.innerText(),/CLOSE QUARTERS/);
  assert.match(await page.locator('.mode-grid .mode-tdm').innerText(),/15 KOs/);
  fs.mkdirSync('qa-screens/beta1-mode-cards',{recursive:true});
  await page.screenshot({path:'qa-screens/beta1-mode-cards/modes-'+width+'x'+height+'.png',animations:'disabled'});
  await page.locator('.mode-back').click();
  assert.ok(await page.locator('.home-screen').isVisible(),'back returns home');
  assert.deepEqual(errors,[],'no script exceptions');
  done.push({viewport:width+'x'+height,assets:loaded.map(x=>x[0]),preservedActions:true,keyboardFocus:true,back:true});
  await page.close();
 }
 fs.mkdirSync('qa-results',{recursive:true});
 fs.writeFileSync('qa-results/beta1-mode-cards-browser.json',JSON.stringify({result:'PASS',cases:done},null,2)+'\n');
 console.log('BETA1_MODE_CARDS_BROWSER_PASS '+JSON.stringify(done));
}finally{await browser.close()}
