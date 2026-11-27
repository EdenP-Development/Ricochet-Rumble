// Controlled first-release rehearsal version pair. No signing or release authorization.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
export function validatePair(previous,next){
 const valid=v=>v&&Number.isInteger(v.code)&&v.code>0&&v.code<=2100000000&&typeof v.name==='string'&&/^0\.9\.80-beta\.[1-9][0-9]*$/.test(v.name)&&v.name==='0.9.80-beta.'+v.code;
 assert.ok(valid(previous)&&valid(next),'invalid controlled beta version');
 assert.equal(previous.code,1,'first rehearsal baseline must be 1');
 assert.equal(next.code,previous.code+1,'rehearsal version must increase by one');
 return {previous,next,package:'com.playereden.ricochetrumble.beta',scope:'unsigned rehearsal only'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [a,b,c,d]=process.argv.slice(2);
 assert.ok(/^[1-9][0-9]*$/.test(a)&&/^[1-9][0-9]*$/.test(c),'noncanonical version code');
 console.log(JSON.stringify(validatePair({code:Number(a),name:b},{code:Number(c),name:d})));
}
