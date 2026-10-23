const headers={'Content-Type':'application/json','Cache-Control':'no-store'};
const reply=(status,body)=>new Response(JSON.stringify(body),{status,headers});
export async function onRequest({request,env}){
 if(request.method!=='POST')return new Response('Method not allowed',{status:405,headers:{...headers,Allow:'POST'}});
 const origin=request.headers.get('Origin');
 if(!origin||origin!==new URL(request.url).origin)return reply(403,{ok:false});
 if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json'))return reply(415,{ok:false});
 let data;
 try{
 const reader=request.body?.getReader();if(!reader)return reply(400,{ok:false});
 let size=0,chunks=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();return reply(413,{ok:false});}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}data=JSON.parse(new TextDecoder().decode(bytes));
 }catch{return reply(400,{ok:false});}
 if(!data||typeof data!=='object')return reply(400,{ok:false});
 if(data.website)return reply(400,{ok:false});
 const name=typeof data.firstName==='string'?data.firstName.trim():'';
 const email=typeof data.email==='string'?data.email.trim().toLowerCase():'';
 if(!name||name.length>80||/[\u0000-\u001f\u007f]/.test(name)||email.length>254||!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(email)||data.consent!==true)return reply(400,{ok:false});
 if(!env.DB)return reply(503,{ok:false});
 try{
 await env.DB.prepare('INSERT INTO signups (first_name,email,event,consent_version) VALUES (?,?,?,?) ON CONFLICT(email,event) DO NOTHING').bind(name,email,'2026-nadgc','nadgc-2026-v1').run();
 return reply(200,{ok:true});
 }catch{return reply(503,{ok:false});}
}
