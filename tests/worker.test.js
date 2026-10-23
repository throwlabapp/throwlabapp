import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

test('Worker signup uses D1 and does not fall through to static assets', async()=>{
 let saved, staticUsed=false;
 const env={DB:{prepare(){return {bind(...values){saved=values;return {async run(){}};}};}},ASSETS:{fetch(){staticUsed=true;throw Error('unexpected');}}};
 const request=new Request('https://throwlabapp.com/api/signup',{method:'POST',headers:{Origin:'https://throwlabapp.com','Content-Type':'application/json'},body:JSON.stringify({firstName:'Avery',email:'avery@example.com',consent:true,website:''})});
 const result=await worker.fetch(request,env);
 assert.equal(result.status,200);assert.deepEqual(await result.json(),{ok:true});
 assert.equal(saved[2],'2026-nadgc');assert.equal(staticUsed,false);
});
test('Worker sends ordinary page requests to the asset binding',async()=>{
 let pathname;
 const response=await worker.fetch(new Request('https://throwlabapp.com/nadgcatx2026/?kiosk=1'),{ASSETS:{async fetch(request){pathname=new URL(request.url).pathname;return new Response('event page');}}});
 assert.equal(await response.text(),'event page');assert.equal(pathname,'/nadgcatx2026/');
});
test('Unknown API paths return 404 rather than a website page',async()=>{
 const result=await worker.fetch(new Request('https://throwlabapp.com/api/unknown'),{ASSETS:{fetch(){throw Error('unexpected');}}});
 assert.equal(result.status,404);
});
