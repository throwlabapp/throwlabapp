import {test} from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/signup.js';
const valid={firstName:' Avery ',email:' AVERY@example.com ',consent:true,website:''};
function req(data=valid,extras={}){return new Request('https://throwlabapp.com/api/signup',{method:'POST',headers:{Origin:'https://throwlabapp.com','Content-Type':'application/json',...extras},body:JSON.stringify(data)});}
test('normalizes, binds values and acknowledges only committed storage',async()=>{let values;const env={DB:{prepare(sql){assert.match(sql,/ON CONFLICT/);return{bind(...v){values=v;return{async run(){}}}}}}};const response=await onRequest({request:req(),env});assert.equal(response.status,200);assert.deepEqual(values,['Avery','avery@example.com','2026-nadgc','nadgc-2026-v1']);});
test('rejects missing consent, invalid email, oversized input and spam trap',async()=>{for(const data of [{...valid,consent:false},{...valid,email:'bad'},{...valid,firstName:'x'.repeat(81)},{...valid,website:'spam'},null])assert.equal((await onRequest({request:req(data),env:{}})).status,400);});
test('rejects cross origin, unsupported method and huge body',async()=>{assert.equal((await onRequest({request:req(valid,{Origin:'https://other.test'}),env:{}})).status,403);assert.equal((await onRequest({request:new Request('https://throwlabapp.com/api/signup'),env:{}})).status,405);assert.equal((await onRequest({request:req({...valid,firstName:'x'.repeat(5000)}),env:{}})).status,413);});
test('missing binding and database failure never report success',async()=>{assert.equal((await onRequest({request:req(),env:{}})).status,503);assert.equal((await onRequest({request:req(),env:{DB:{prepare(){throw Error('offline')}}}})).status,503);});
