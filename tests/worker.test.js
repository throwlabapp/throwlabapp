import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
test('serves website pages through assets',async()=>{
 const response=await worker.fetch(new Request('https://throwlabapp.com/about/'),{ASSETS:{fetch:async()=>new Response('About Josh')}});
 assert.equal(await response.text(),'About Josh');
});
test('retired signup endpoint cannot collect submissions',async()=>{
 const response=await worker.fetch(new Request('https://throwlabapp.com/api/signup',{method:'POST'}),{});
 assert.equal(response.status,404);
});
