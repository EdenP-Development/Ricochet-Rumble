import assert from 'node:assert/strict';
import {validatePair} from '../tools/sr-hub-12c-version-pair.mjs';
const v=n=>({code:n,name:'0.9.80-beta.'+n});
assert.equal(validatePair(v(1),v(2)).next.code,2);
const invalid=[[v(1),v(1)],[v(2),v(1)],[v(1),v(3)],[v(2),v(3)],[v(0),v(1)],[v(-1),v(0)],[v(1),v(2.5)],[v(1),v(2147483647)],[v(1),{code:2,name:'0.9.80-beta.1'}],[v(1),{code:2,name:'0.9.80-beta.02'}],[v(1),{code:2,name:'0.9.81-beta.2'}],[v(1),{code:'2',name:'0.9.80-beta.2'}],[null,v(2)]];
for(const args of invalid)assert.throws(()=>validatePair(...args));
console.log('SR_HUB_12C_VERSION_CONTRACT_PASS '+(1+invalid.length));
