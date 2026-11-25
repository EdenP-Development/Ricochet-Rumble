// Sector Rebound standalone Spudacus startup — source-level acceptance contract.
// This does not pretend to be a physical UI test. The APK and emulator are
// verified separately in the workflow; this guards game/save/identity isolation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const read=p=>fs.readFileSync(p,'utf8');
const root='android/app/';
const java=read(root+'src/main/java/com/playereden/ricochetrumble/StartupBrandingOverlay.java');
const activity=read(root+'src/main/java/com/playereden/ricochetrumble/MainActivity.java');
const gradle=read(root+'build.gradle');
const manifest=read(root+'src/main/AndroidManifest.xml');
const asset=fs.readFileSync(root+'src/main/assets/branding/spudacus-v1-full-transparent.png');
const hash=crypto.createHash('sha256').update(asset).digest('hex');
assert.equal(hash,'74773dbda822161f73a639f959e8bce5c6e0b333a94ebeb8ee27f620d4995d25','approved unmodified artwork');
assert.equal(asset.subarray(0,8).toString('hex'),'89504e470d0a1a0a','real PNG');
assert.match(java,/ASSET = "branding\/spudacus-v1-full-transparent.png"/);
assert.match(java,/Color\.rgb\(250, 231, 205\)/);
assert.match(java,/FADE_IN_MS = 250, HOLD_MS = 1000, FADE_OUT_MS = 250/);
assert.match(java,/ImageView\.ScaleType\.FIT_CENTER/);
assert.match(java,/ValueAnimator\.areAnimatorsEnabled\(\)/);
assert.match(java,/surface\.setOnClickListener\(/);
assert.match(java,/MotionEvent\.ACTION_UP/);
assert.match(java,/getSystemWindowInset/);
assert.match(java,/handler\.removeCallbacks\(exitDelay\)/);
assert.match(java,/parent\.removeView\(surface\)/);
assert.match(activity,/web\.loadUrl\(initialPage\);[\s\S]*StartupBrandingOverlay\.attach\(this, startupRoot\)/);
assert.match(activity,/savedInstanceState == null && getPackageName\(\)\.endsWith\("\.spudacusqa"\)/);
assert.match(activity,/startupBranding != null && startupBranding\.isVisible\(\)/);
assert.match(activity,/@Override protected void onStop\(\) \{\s*if \(startupBranding != null\) startupBranding\.skip\(\)/);
assert.match(gradle,/if \(spudacusStartupQA == 'true'\) applicationIdSuffix '\.spudacusqa'/);
assert.match(gradle,/spudacusStartupQA == 'true' && \(previewPackageSwitch != null \|\| hybridLabPackage != null\)/);
assert.match(manifest,/android:screenOrientation="sensorLandscape"/);
assert.ok(!java.includes('GridMates')&&!java.includes('Eden Practical')&&!java.includes('EPS'),'standalone-only');
assert.ok(!java.includes('HttpURLConnection')&&!java.includes('SoundPool')&&!java.includes('MediaPlayer'),'offline and silent');
for(const name of ['game.js','index.html','style.css','scored-match.js','save-backup.js','dossier.js']){
 assert.ok(fs.readFileSync('web/'+name).equals(fs.readFileSync(root+'src/main/assets/'+name)),name+' source parity');
}
console.log('SPUDACUS_STARTUP_SOURCE_CONTRACT_PASS '+JSON.stringify({brand:'Spudacus only',assetSHA256:hash,
 coldLaunchOnly:true,individualLogoDurationMs:1500,skippable:true,offline:true,
 isolatedPackage:'com.playereden.ricochetrumble.spudacusqa',sourceParity:true,physicalPhoneTested:false}));
