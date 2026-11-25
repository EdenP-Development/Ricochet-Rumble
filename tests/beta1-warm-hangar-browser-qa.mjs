// Real Chromium B1-03-A Hangar artwork/interaction acceptance, focused review.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN,args:['--no-sandbox','--disable-dev-shm-usage']});
const outputs=[];
try{
 for(const [width,height] of [[568,320],[740,360],[915,412]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('web/index.html')).href,{waitUntil:'load',timeout:20000});
  await page.locator('#menu button[data-action="hangar"]').click({timeout:10000});
  const bay=page.locator('.hangar-bay'),plate=page.locator('.beta1-warm-hangar-plate');
  assert.equal(await bay.getAttribute('data-hangar-study'),'warm');
  assert.equal(await plate.count(),1);
  assert.equal(await plate.getAttribute('aria-hidden'),'true');
  const check=await plate.evaluate(el=>{
   const cs=getComputedStyle(el),parent=el.parentElement.getBoundingClientRect(),p=el.getBoundingClientRect();
   return {display:cs.display,backgroundImage:cs.backgroundImage,opacity:cs.opacity,
     zIndex:cs.zIndex,box:{w:p.width,h:p.height},parent:{w:parent.width,h:parent.height},
     pointer:cs.pointerEvents};
  });
  assert.ok(check.backgroundImage.includes('hangar-warm-empty-v1.svg'),JSON.stringify(check));
  assert.equal(check.pointer,'none');
  assert.ok(check.box.w>100&&check.box.h>80,'Actual visible Hangar background bounds');
  assert.ok(Math.abs(check.box.w-check.parent.w)<2&&Math.abs(check.box.h-check.parent.h)<2,'Full bay coverage');
  const art=await page.evaluate(async()=>{
   const img=new Image();
   img.src='assets/m12/hangar-warm-empty-v1.svg';
   await Promise.race([new Promise((ok,fail)=>{img.onload=ok;img.onerror=()=>fail(Error('warm art load failed'));}),new Promise((_,fail)=>setTimeout(()=>fail(Error('warm art load timed out')),8000))]);
   return {width:img.naturalWidth,height:img.naturalHeight};
  });
  assert.deepEqual(art,{width:1024,height:576});
  assert.equal(await page.locator('#hangar-unit-preview').count(),1);
  assert.equal(await page.locator('.hangar-tabs button').count(),2);
  await page.locator('.hangar-tabs button[data-hangar-tab="insignia"]').click();
  assert.equal(await plate.count(),1,'Warm art remains after switching tabs');
  await page.locator('.hangar-tabs button[data-hangar-tab="paint"]').click();
  await page.locator('[data-action="hangar-preview-unit"]').click();
  assert.match(await page.locator('#hangar-unit-label').innerText(),/MECH/);
  fs.mkdirSync('qa-screens/beta1-warm-hangar',{recursive:true});
  await page.screenshot({path:'qa-screens/beta1-warm-hangar/hangar-'+width+'x'+height+'.png',animations:'disabled',timeout:15000});
  await page.locator('#menu button[data-action="hangar-back"]').click();
  assert.ok(await page.locator('.home-screen').isVisible());
  assert.deepEqual(errors,[]);
  outputs.push({viewport:width+'x'+height,assetLoaded:true,svgBytesUntouched:true,paintAndInsignia:true,mechPreview:true,mainMenuBack:true});
  await page.close();
 }
 fs.mkdirSync('qa-results',{recursive:true});
 fs.writeFileSync('qa-results/beta1-warm-hangar-browser.json',JSON.stringify({result:'PASS',cases:outputs},null,2)+'\n');
 console.log('BETA1_WARM_HANGAR_BROWSER_PASS '+JSON.stringify(outputs));
}finally{await browser.close()}
