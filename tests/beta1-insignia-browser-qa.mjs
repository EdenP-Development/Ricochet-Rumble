// Real Chromium B1-03-C Hangar/Dossier insignia parity, lock truth and layout.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN,args:['--no-sandbox','--disable-dev-shm-usage']});
const report=[];
try{
 for(const [width,height] of [[568,320],[740,360],[915,412]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('web/index.html')).href,{waitUntil:'load',timeout:25000});
  await page.locator('#menu button[data-action="hangar"]').click({timeout:12000});
  await page.locator('.hangar-tabs button[data-hangar-tab="insignia"]').click();
  const buttons=page.locator('.emblem-grid button[data-action="equip-emblem"]');
  assert.equal(await buttons.count(),4);
  const field=buttons.filter({has:page.locator('use[href="#sr-mark-field"]')});
  assert.equal(await field.count(),1);
  assert.equal(await field.getAttribute('aria-pressed'),'true');
  assert.equal(await field.isDisabled(),false);
  for(const id of ['vector','ace','command']){
   const item=page.locator('.emblem-grid button[data-emblem-id="mark.'+id+'"]');
   assert.equal(await item.isDisabled(),true,'unearned '+id+' locked');
   assert.match(await item.getAttribute('aria-label'),/LOCKED/);
  }
  for(const [id,sel] of [['field','.emblem-grid button[data-emblem-id="mark.field"] .emblem-symbol'],
                         ['vector','.emblem-grid button[data-emblem-id="mark.vector"] .emblem-symbol'],
                         ['ace','.emblem-grid button[data-emblem-id="mark.ace"] .emblem-symbol'],
                         ['command','.emblem-grid button[data-emblem-id="mark.command"] .emblem-symbol'],
                         ['field','.insignia-detail-mark']]){
   const a=await page.locator(sel).evaluate(el=>({bg:getComputedStyle(el).backgroundImage,box:el.getBoundingClientRect().toJSON()}));
   assert.ok(a.bg.includes('insignia-'+id+'-study-v1.svg'),sel+' '+JSON.stringify(a));
   // Existing <=330px landscape style intentionally hides the bulky detail
   // panel so the actual four selectable insignia cards fit the phone.
   if(sel==='.insignia-detail-mark'&&height<=330){
    assert.equal(a.box.height,0,'compact phone intentionally hides detail panel');
   }else assert.ok(a.box.width>15&&a.box.height>15,sel+' actual bounds');

  }
  assert.match(await page.locator('#insignia-detail-name').innerText(),/FIELD/);
  // Check all four source images without modifying unlocks, save state or game code.
  const loaded=await page.evaluate(async()=>Promise.all(['field','vector','ace','command'].map(id=>new Promise((resolve,reject)=>{
   const img=new Image();img.onload=()=>resolve(id);img.onerror=()=>reject(Error(id+' artwork load failed'));
   img.src='assets/m12/insignia-'+id+'-study-v1.svg';
  }))));
  assert.deepEqual(loaded,['field','vector','ace','command']);
  // Presentation-only: changing the SVG reference in a detached dummy element
  // proves that the same artwork follows the actual, already-existing <use> ID.
  const selectorTest=await page.evaluate(()=>{
   const host=document.createElement('span');host.id='dossier-emblem-mark';
   host.innerHTML='<svg><use href="#sr-mark-ace"/></svg>';
   const main=document.querySelector('#dossier-emblem-mark');if(main)return 'unexpected existing dossier';
   const panel=document.querySelector('#panel');panel.append(host);
   const before=getComputedStyle(host).backgroundImage;host.querySelector('use').setAttribute('href','#sr-mark-command');
   const after=getComputedStyle(host).backgroundImage;host.remove();
   return {before,after};
  });
  assert.ok(selectorTest.before.includes('insignia-ace-study-v1.svg'));
  assert.ok(selectorTest.after.includes('insignia-command-study-v1.svg'));
  fs.mkdirSync('qa-screens/beta1-insignia',{recursive:true});
  await page.screenshot({path:'qa-screens/beta1-insignia/hangar-'+width+'x'+height+'.png',animations:'disabled'});
  await page.locator('#menu button[data-action="hangar-back"]').click();
  assert.ok(await page.locator('.home-screen').isVisible());
  await page.locator('#menu button[data-action="dossier"]').click();
  assert.equal(await page.locator('#dossier-emblem-name').innerText(),'FIELD');
  const dossier=await page.locator('#dossier-emblem-mark').evaluate(el=>({bg:getComputedStyle(el).backgroundImage,href:el.querySelector('use')?.getAttribute('href')}));
  assert.equal(dossier.href,'#sr-mark-field');
  assert.ok(dossier.bg.includes('insignia-field-study-v1.svg'),JSON.stringify(dossier));
  await page.screenshot({path:'qa-screens/beta1-insignia/dossier-'+width+'x'+height+'.png',animations:'disabled'});
  await page.locator('#menu button[data-action="dossier-back"]').click();
  assert.ok(await page.locator('.home-screen').isVisible());
  assert.deepEqual(errors,[],'no script exceptions');
  report.push({viewport:width+'x'+height,locked:true,realEquippedArt:true,allFourLoaded:true,dossier:true,back:true});
  await page.close();
 }
 fs.mkdirSync('qa-results',{recursive:true});
 fs.writeFileSync('qa-results/beta1-insignia-browser.json',JSON.stringify({result:'PASS',cases:report},null,2)+'\n');
 console.log('BETA1_INSIGNIA_BROWSER_PASS '+JSON.stringify(report));
}finally{await browser.close()}
