const form=document.querySelector('#signup-form');
const message=document.querySelector('#form-message');
const success=document.querySelector('#success');
const submit=form.querySelector('[type=submit]');
const kiosk=new URLSearchParams(location.search).get('kiosk')==='1';
if(kiosk)document.body.classList.add('kiosk');
let nextTimer,idleTimer,busy=false;
function reset(){clearTimeout(nextTimer);clearTimeout(idleTimer);form.reset();message.textContent='';success.hidden=true;form.hidden=false;submit.disabled=false;busy=false;}
function idle(){clearTimeout(idleTimer);if(kiosk&&!busy)idleTimer=setTimeout(reset,90000);}
form.addEventListener('input',idle);
document.querySelector('#next-person').addEventListener('click',()=>{reset();document.querySelector('#first-name').focus();});
window.addEventListener('pageshow',reset);
form.addEventListener('submit',async event=>{
 event.preventDefault();if(busy||!form.reportValidity())return;
 busy=true;clearTimeout(idleTimer);submit.disabled=true;message.textContent='Saving your signup…';
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
 try{
 const response=await fetch('/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({firstName:form.firstName.value,email:form.email.value,consent:form.consent.checked,website:form.website.value}),signal:controller.signal});
 if(!response.ok)throw new Error('save');
 const result=await response.json();if(!result.ok)throw new Error('save');
 form.reset();message.textContent='';form.hidden=true;success.hidden=false;success.focus();if(kiosk)nextTimer=setTimeout(reset,10000);
 }catch{message.textContent='Signup was not confirmed. Check the connection and try again. Retrying won’t create a duplicate.';submit.disabled=false;}
 finally{clearTimeout(timeout);busy=false;idle();}
});
