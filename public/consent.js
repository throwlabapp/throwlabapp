(function(){
  const key='throwlab_analytics_consent';
  const banner=document.getElementById('consent-banner');
  const accept=document.getElementById('consent-accept');
  const decline=document.getElementById('consent-decline');
  const footerLinks=document.querySelector('.footer-links');

  function show(){if(banner){banner.hidden=false;}}
  function hide(){if(banner){banner.hidden=true;}}
  function save(value){
    localStorage.setItem(key,value);
    if(typeof window.gtag==='function'){
      window.gtag('consent','update',{
        analytics_storage:value==='accepted'?'granted':'denied',
        ad_storage:'denied',
        ad_user_data:'denied',
        ad_personalization:'denied'
      });
    }
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:'consent_update',analytics_consent:value});
    hide();
  }

  if(!localStorage.getItem(key)){show();}
  if(accept){accept.addEventListener('click',function(){save('accepted');});}
  if(decline){decline.addEventListener('click',function(){save('declined');});}

  if(footerLinks){
    const manage=document.createElement('button');
    manage.type='button';
    manage.className='consent-manage';
    manage.textContent='Cookie settings';
    manage.addEventListener('click',show);
    footerLinks.appendChild(manage);
  }
})();
