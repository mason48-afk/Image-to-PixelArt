import fs from 'node:fs';
import {locales,names,faq} from './public/locales.mjs';
const config=JSON.parse(fs.readFileSync('site.config.json','utf8'));
const origin=(config.origin||process.env.CF_PAGES_URL||'https://image-to-pixelart.pages.dev').replace(/\/$/,'');
if(!/^https:\/\/[a-z\d.-]+$/i.test(origin))throw Error('Invalid canonical origin');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
fs.rmSync('dist',{recursive:true,force:true});fs.cpSync('public','dist',{recursive:true});
const path=lang=>lang==='en'?'/':'/'+lang+'/';
const template=fs.readFileSync('template.html','utf8');
for(const [lang,t] of Object.entries(locales)){
 let page=template.replaceAll('{{LANG}}',lang).replaceAll('{{DIR}}',lang==='ar'?'rtl':'ltr').replaceAll('{{TITLE}}',esc(t.title+' | PixelPress — '+t.free)).replaceAll('{{DESCRIPTION}}',esc(t.intro+' '+t.free)).replaceAll('{{URL}}',origin+path(lang));
 page=page.replace('{{ALTERNATES}}',Object.keys(names).map(l=>`<link rel="alternate" hreflang="${l}" href="${origin+path(l)}">`).join('')+`<link rel="alternate" hreflang="x-default" href="${origin}/">`);
 page=page.replace('{{LANGUAGES}}',Object.entries(names).map(([l,name])=>`<option value="${l}"${lang===l?' selected':''}>${name}</option>`).join(''));
 page=page.replace('{{FAQ}}',[0,1,2].map(g=>`<h3>${t['group'+(g+1)]}</h3><div class="faq-grid">${faq[lang].slice(g*2,g*2+2).map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`).join(''));
 page=page.replace('{{SHOP}}',[['tablet','drawing tablet for digital art'],['beads','fuse bead kit adults'],['book','pixel art book']].map(([k,q])=>`<article class="card"><h3 data-i18n="${k}">${t[k]}</h3><p data-i18n="${k}P">${t[k+'P']}</p><a href="https://www.amazon.com/s?k=${encodeURIComponent(q)}&amp;tag=${config.amazonTrackingId}" target="_blank" rel="sponsored noopener noreferrer" data-i18n="shop">${t.shop}</a> <span class="small" data-i18n="paid">${t.paid}</span></article>`).join(''));
 page=page.replace(/(<[^>]+data-i18n="([^"]+)"[^>]*>)[^<]*(<\/[^>]+>)/g,(_,a,key,b)=>a+esc(t[key])+b);
 if(lang==='en')page=page.replace('<span lang="en">As an Amazon Associate I earn from qualifying purchases.</span>','');
 if(config.adsenseApproved&&config.consentConfigured){
  if(!/^ca-pub-\d{16}$/.test(config.adsensePublisherId))throw Error('Invalid publisher');
  page=page.replace('</head>',`<script async crossorigin="anonymous" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsensePublisherId}"></script></head>`);
  for(const [slot,id] of Object.entries(config.adSlots)){if(!/^\d+$/.test(id))throw Error('Missing ad slot');page=page.replace(`data-ad-slot="${slot}" aria-label="Advertisement"></aside>`,`data-ad-slot="${slot}" aria-label="Advertisement"><small>Advertisement</small><ins class="adsbygoogle" style="display:block" data-ad-client="${config.adsensePublisherId}" data-ad-slot="${id}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(window.adsbygoogle=window.adsbygoogle||[]).push({});</script></aside>`);}
 }
 fs.mkdirSync('dist'+path(lang),{recursive:true});fs.writeFileSync('dist'+path(lang)+'index.html',page);
}
for(const file of ['about.html','privacy.html']){let page=fs.readFileSync('public/'+file,'utf8').replaceAll('{{ORIGIN}}',origin);fs.writeFileSync('dist/'+file,page);}
fs.writeFileSync('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...Object.keys(names).map(path),'/about.html','/privacy.html'].map(p=>`<url><loc>${origin+p}</loc></url>`).join('')+'</urlset>');
fs.writeFileSync('dist/ads.txt',`google.com, ${config.adsensePublisherId.replace('ca-','')}, DIRECT, f08c47fec0942fa0\n`);
console.log('Built 8 languages, 2 information pages, sitemap and ads.txt. Ad units: '+(config.adsenseApproved&&config.consentConfigured));
